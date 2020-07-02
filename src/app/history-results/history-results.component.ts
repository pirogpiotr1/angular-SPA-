import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HistoryResultsService } from '../history-results.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';  
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewChild } from '@angular/core'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FormGroup, FormControl} from '@angular/forms';
import {MomentDateAdapter,MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { Router,NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

interface Provider {
  data:Array<Team>
}
interface Team {
  id:number,
  full_name: string
}

@Component({
  selector: 'app-history-results',
  templateUrl: './history-results.component.html',
  styleUrls: ['./history-results.component.scss'],
  providers: [
    
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  host: {'class': 'history-results'}
})
export class HistoryResultsComponent implements OnInit {
  
  dateStart = new FormControl(moment());
  dateEnd = new FormControl(moment());
  seasonFrom:number = this.dateStart.value.format('YYYY');;
  seasonTo:number = this.dateEnd.value.format('YYYY');;
 
  
 
  selectedTeam:Team;
  myControl = new FormControl();
  options:any;
  filteredOptions: Observable<string[]>;
  games: MatTableDataSource<any> ;



  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private dataService: DataService, private HistoryResultsService: HistoryResultsService, private router: Router) {
    router.events.subscribe((val) => {
      // see also 
        if(val instanceof NavigationEnd && this.selectedTeam){
           
            if(this.seasonFrom){
              this.sendSeasonFrom();
            }

            if(this.seasonTo){
             this.sendSeasonTo();
            }

            this.sendTeam();
        }
      
  });
  }

  ngOnInit(): void {
    this.dataService.getAllTeams().subscribe( (data:Provider) =>{
    this.options = data.data ;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
    
    
  }

  sendTeam(){
    this.HistoryResultsService.setTeam( this.selectedTeam );
  }

  sendSeasonFrom(){
    this.HistoryResultsService.setSeasonFrom( this.seasonFrom );
  }

  sendSeasonTo(){
    this.HistoryResultsService.setSeasonTo( this.seasonTo );
  }

  private _filter(value: string): string[] {
    let filterValue
    try{
      filterValue = value.toLowerCase();}
    catch(e){
    }
  
    return this.options.filter(  option => option.full_name.toLowerCase().includes(filterValue));
  }

  onTeamSelected(selectedTeam:Team) {
    this.selectedTeam = selectedTeam;
    this.sendTeam();
  }

  displayFn( team ){
    return team && team.full_name ? team.full_name : '';
  }

  chosenStartYearHandler(normalizedYear: _moment.Moment, datepicker) {
    const ctrlValue = this.dateStart.value;
    ctrlValue.year(normalizedYear.year());
    this.dateStart.setValue(ctrlValue);
    this.seasonFrom = ctrlValue.format('YYYY');
    this.sendSeasonFrom();
    
    datepicker.close();
  }

  chosenEndYearHandler(normalizedYear: _moment.Moment, datepicker) {
    const ctrlValue = this.dateEnd.value;
    ctrlValue.year(normalizedYear.year());
    this.dateEnd.setValue(ctrlValue);
    this.seasonTo = ctrlValue.format('YYYY');
    this.sendSeasonTo();
    datepicker.close();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.HistoryResultsService.clearTeam();
    this.HistoryResultsService.clearSeasons();
  }
}

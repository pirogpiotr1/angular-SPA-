import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { DataService} from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
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
import {MatSort} from '@angular/material/sort'
import {MatSortModule} from '@angular/material/sort';

import { Subscription } from 'rxjs/Subscription';
import { HistoryResultsService } from '../history-results.service';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';



const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

interface Provider {
  data:[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HomeComponent implements OnInit {
  subscriptionTeam: Subscription;
  subscriptionSeasonFrom: Subscription;
  subscriptionSeasonTo: Subscription;

  team:any;
  seasonFrom:any;
  seasonTo:any;

  dateStart = new FormControl(moment());
  dateEnd = new FormControl(moment());

  games: MatTableDataSource<any> ;

  columnsToDisplay = [ 'season', 'opponent_team', 'result','selected_team_score', 'opponent_team_score','date' ];

  @Output() 
  dateChange:EventEmitter< MatDatepickerInputEvent< any>>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( private data:DataService, private historyResultService:HistoryResultsService ) { 
    this.subscriptionTeam = this.historyResultService.getTeam().subscribe( team => {
      this.team = team;
     
      this.getGamesByTeam();
    })

    this.subscriptionSeasonFrom = this.historyResultService.getSeasonFrom().subscribe( season => {
      this.seasonFrom = season;
      if( this.team ){
        this.getGamesByTeam();
      }
    })

    this.subscriptionSeasonTo = this.historyResultService.getSeasonTo().subscribe( season => {
      this.seasonTo = season;
      if( this.team ){
        this.getGamesByTeam();
      }
    })
  }

  getGamesByTeam(){
    this.data.getGamesByTeamIdAndSeasons( this.team.id, this.seasonFrom, this.seasonTo ).subscribe( (data:Provider) =>{
      this.games = new MatTableDataSource(data.data);
      this.games.paginator = this.paginator;
      this.games.sort = this.sort;

      this.games.filterPredicate = function( data, filter: string): boolean {
        let val:any;

        try {
          val = JSON.parse(filter);
        } catch (e) {
           val = filter;
        }

        switch( typeof val){
          case 'string':
              return data.visitor_team.full_name.toLowerCase().includes(filter) || data.visitor_team.abbreviation.toLowerCase().includes(filter);
          break;
          case 'object':
         
            if(val.name === 'END_YEAR'){
              return data.season <= val.val;
            }else if(val.name === 'START_YEAR'){
              return data.season >= val.val;
            }
          
          break;
        }
      };

    }); 
  }

  ngOnInit(): void {
    console.log(this.team);
  }
  ngOnDestroy() {
    this.subscriptionTeam.unsubscribe();
    this.subscriptionSeasonFrom.unsubscribe();
    this.subscriptionSeasonTo.unsubscribe();
  }

  filterName( filterVal:string ){
    this.games.filter = filterVal.trim().toLowerCase();
  }
  
  filterDate( filterVal:object ){
   console.log(filterVal);
   // this.games.filter = filterVal;
  }

  chosenStartYearHandler(normalizedYear: _moment.Moment, datepicker) {
    const ctrlValue = this.dateStart.value;
    ctrlValue.year(normalizedYear.year());
    this.dateStart.setValue(ctrlValue);
    this.games.filter = JSON.stringify({val:ctrlValue.format('YYYY'), name:'START_YEAR'});;
    datepicker.close();
  }
  chosenEndYearHandler(normalizedYear: _moment.Moment, datepicker) {
    const ctrlValue = this.dateEnd.value;
    ctrlValue.year(normalizedYear.year());
    this.dateEnd.setValue(ctrlValue);

    this.games.filter = JSON.stringify( {val:ctrlValue.format('YYYY'), name:'END_YEAR'} );

    datepicker.close();
  }


}

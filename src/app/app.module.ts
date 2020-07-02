import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { HomeComponent } from './home/home.component';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormsModule, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms/';
import { YearPickerComponent } from './year-picker/year-picker.component';
import { HistoryResultsComponent } from './history-results/history-results.component';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import {MatSort} from '@angular/material/sort'
import { HistoryResultsService } from './history-results.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SecondPageComponent,
    HomeComponent,
    YearPickerComponent,
    HistoryResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    
  ],
  providers: [HistoryResultsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

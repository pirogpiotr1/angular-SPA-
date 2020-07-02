import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { SecondPageComponent } from './second-page/second-page.component'


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'second', component: SecondPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

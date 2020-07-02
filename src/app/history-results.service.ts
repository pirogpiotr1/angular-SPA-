import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HistoryResultsComponent } from './history-results/history-results.component';

@Injectable()
export class HistoryResultsService {
  private team= new Subject<HistoryResultsComponent>();
  private seasonFrom = new Subject<HistoryResultsComponent>();
  private seasonTo = new Subject<HistoryResultsComponent>();
  
  getTeam(){
    return this.team.asObservable();
  }
  getSeasonFrom(){
    return this.seasonFrom.asObservable();
  }
  getSeasonTo(){
    return this.seasonTo.asObservable();
  }

  clearTeam(){
    this.team.next()
  }

  clearSeasons(){
    this.seasonTo.next();
    this.seasonFrom.next();
  }

  setTeam( team ){
    this.team.next( team )
  }

  setSeasonFrom( season ){
    this.seasonFrom.next(season);
  }

  setSeasonTo( season ){
    this.seasonTo.next(season);
  }

  constructor() { }
}

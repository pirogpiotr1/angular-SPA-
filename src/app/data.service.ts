import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  gamesUrl:string = 'https://free-nba.p.rapidapi.com/games';
  teamsUrl:string = 'https://free-nba.p.rapidapi.com/teams';
  headers = {
    "headers": {
      "x-rapidapi-host": "free-nba.p.rapidapi.com",
      "x-rapidapi-key": "797995f7fcmsh8ad1b3002396a60p1e3848jsn43768520d893"
    }
  }

  constructor( private http: HttpClient ) { }
  
  getAllGames() {
    return this.http.get(this.gamesUrl,this.headers);
  }

  getAllTeams() {
    return this.http.get(this.teamsUrl,this.headers);
  }

  getGamesByTeamIdAndSeasons( id:number, seasonFrom:number = null, seasonTo:number = null ) {
    let call =`${this.gamesUrl}?team_ids=${id}`;

    if( seasonFrom && seasonTo ){

      if(seasonFrom > seasonTo){ console.error('seasonFrom bigger than season 2'); return; }
      call += `&Seasons=`;
      
      while( seasonFrom <= seasonTo ){
       
        call += `${seasonFrom},`;
        seasonFrom ++;
        
      }

    call = call.slice(0, -1);
      
    }else if(seasonFrom || seasonTo ){
      call += `&Seasons=`;
      seasonFrom ? call += seasonFrom:call += seasonTo;
    }
    console.log(call);
    return this.http.get(call, this.headers);
  }
}

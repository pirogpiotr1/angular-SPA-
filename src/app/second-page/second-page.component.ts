import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataService} from '../data.service';
import { HistoryResultsService } from '../history-results.service';
import { Chart } from 'chart.js';

interface Provider {
  data:[]
}

interface Game {
  date:any,
  home_team_score:number,
  home_team:{
    id:number
  },
  visitor_team_score
}

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.scss']
})
export class SecondPageComponent implements OnInit {
  subscriptionTeam: Subscription;
  subscriptionSeasonFrom: Subscription;
  subscriptionSeasonTo: Subscription;

  team:any;
  seasonFrom:any;
  seasonTo:any;

  gamesDates = [];
  pointScored = [];
  pointConceded  = [];
  chart = [];

  constructor( private data:DataService, private historyService:HistoryResultsService ) {
    this.subscriptionTeam = this.historyService.getTeam().subscribe( team => {
      this.team = team;

      this.getGamesByTeam();
    })

    this.subscriptionSeasonFrom = this.historyService.getSeasonFrom().subscribe( season => {
      this.seasonFrom = season;
      if( this.team ){

        this.getGamesByTeam();
      }
    })

    this.subscriptionSeasonTo = this.historyService.getSeasonTo().subscribe( season => {
      this.seasonTo = season;
      if( this.team ){

        this.getGamesByTeam();
      }
    })
  }
  setChart(){
    this.chart = new Chart('canvas',{
      type: "line",
      data:{
        labels: this.gamesDates,
        datasets:[
          {
            data: this.pointScored,
            fill:false,
            borderColor:'green',
            label:'Points Scored'
          },
          {
            data: this.pointConceded,
            fill:false,
            borderColor:'red',
            label:'Points Conceded'
          }
        ],
        options:{
          legend: {
            display: false
          },
          tooltips: {
              enabled: true
          },
          scales:{
            xAxes:[{display:true}],
            YAxes:[{display:true}]
          }
        
        }
      }
    });
  }
  getGamesByTeam(){
    this.gamesDates = [];
    this.data.getGamesByTeamIdAndSeasons( this.team.id, this.seasonFrom, this.seasonTo ).subscribe( (data:Provider) =>{
      let allDates = data.data.map( ( res:Game) => res.date )
      
      this.pointScored = data.data.map( (res:Game) => {
        if(res.home_team.id === this.team.id){
            return res.home_team_score;
        }else{
          return res.visitor_team_score;
        }
      });

      this.pointConceded = data.data.map( (res:Game) => {
        if(res.home_team.id === this.team.id){
            return res.visitor_team_score;
        }else{
          return res.home_team_score;
        }
      });
      allDates.sort(( a , b ) =>  a > b ? 1 : a < b ? -1 : 0 );
      allDates.forEach( res =>{
        let jsDate = new Date( res );
        let dateStr = `${jsDate.getDate()}/${jsDate.getMonth()}/${jsDate.getFullYear()}`
        this.gamesDates.push( dateStr )
      });

      this.setChart();
   }); 
  }

  ngOnInit(): void {
  }

}

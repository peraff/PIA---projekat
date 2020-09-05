import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil-prikaz',
  templateUrl: './profil-prikaz.component.html',
  styleUrls: ['./profil-prikaz.component.css']
})
export class ProfilPrikazComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.korIme=localStorage.getItem('tudji');

    this.http.post<{arg: any}>('http://localhost:3000/podaciOKorisniku', {korIme: this.korIme}).subscribe(odg=>{
      this.korisnik=JSON.parse(odg.arg)
    });

    this.http.post<{arg:any}>('http://localhost:3000/procitane', {korisnik: this.korIme}).subscribe(odg=>{

      this.procitaneKnjige=JSON.parse(odg.arg);

      //pie chart podesavanje
      this.procitaneKnjige.forEach(e => {
      let nizZ: string[]=[];
      nizZ=JSON.parse(e.zanroviK);
      nizZ.forEach(zan => {
        if(!this.pieChartLabels.includes(zan)){
          this.pieChartLabels.push(zan);
        }
          if(this.pieChartLabels.length>this.pieChartData.length) this.pieChartData.push(0);
          this.pieChartData[this.pieChartLabels.indexOf(zan)]++;
      });
    });
    });

    this.http.post<{arg:any}>('http://localhost:3000/trenutnoCita', {korisnik: this.korIme}).subscribe(odg=>{
      this.trenutnoCita=JSON.parse(odg.arg);
    });

    this.http.post<{arg:any}>('http://localhost:3000/dohvatiKomentareZaKorisnika', {korisnik: this.korIme}).subscribe(odg=>{
      this.komentariKorisnika = JSON.parse(odg.arg);
    });
  }

  korisnik: any;
  korIme: string;
  procitaneKnjige: any[]=[];
  trenutnoCita: any[]=[];
  komentariKorisnika: any[]=[];
  pieChartLabels: string[]=[];
  pieChartData: number[]=[];
  public mojeBoje: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD','#800080', '#ffd700', '#008000'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#9932cc',  '#daa520', '#adff2f'],
    }
  ];
}

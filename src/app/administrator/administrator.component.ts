import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  korisnici = [];
  sviKorisnici = [];

  zanrovi = [];
  noviZanr: string="";

  constructor(private https: HttpClient) { }

  ngOnInit(): void {
    this.https.get<{zaht: any}>('http://localhost:3000/zahtevi')
      .subscribe((odg)=>{
        this.korisnici=odg.zaht; 
      });

    this.https.get<{arg: any[]}>('http://localhost:3000/sviKorisnici').subscribe(odg=>{
        this.sviKorisnici = odg.arg;
      });

    this.zanrovi=JSON.parse(localStorage.getItem('zanrovi'));

  }

  prihvatiZahtev(k){
    this.https.post<{mess: string}>('http://localhost:3000/dodajKorisnika', k)
    .subscribe((odg)=>{
      console.log(odg.mess);
      this.korisnici.forEach((e, index) => {
        if(e.korIme==k.korIme) this.korisnici.splice(index,1);
      });
    })
  }

  odbij(k){
    this.https.post<{mess: string}>('http://localhost:3000/obrisiKorisnika', k)
    .subscribe((odg)=>{
      console.log(odg.mess);
      this.korisnici.forEach((e, index) => {
        if(e.korIme==k.korIme) this.korisnici.splice(index,1);
      });
    })
  }

  unapredi(k){
    this.https.post<{mess: string}>('http://localhost:3000/unapredi', k).subscribe(odg=>{
      alert('Usepsno! Osvezite stranicu da biste videli izmene.')
    });
  }

  unazadi(k){
   this.https.post<{mess: string}>('http://localhost:3000/unazadi', k).subscribe(odg=>{
      alert('Usepsno! Osvezite stranicu da biste videli izmene.')
    });
  }


  ukloniZanr(z){
    this.https.post<{fleg: boolean, mess: string}>('http://localhost:3000/ukloniZanr', {zanr: z}).subscribe(odg=>{
      if(odg.fleg==true){
        this.zanrovi.forEach((e, index) => {
          if(e == z) this.zanrovi.splice(index,1);
        });
        localStorage.setItem('zanrovi', JSON.stringify(this.zanrovi));
      }
      alert(odg.mess);
    });
  }

  dodajZanr(){
    this.zanrovi.push(this.noviZanr);
    localStorage.setItem('zanrovi', JSON.stringify(this.zanrovi));
  }
}

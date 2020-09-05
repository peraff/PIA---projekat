import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

import { Korisnik } from 'src/models/Korisnik';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private https: HttpClient, private rut: Router) { }


  kor: Korisnik = {
    ime: "",
    prezime: "",
    korIme: "",
    lozinka: "",
    grad : "",
    drzava: "",
    mejl:"",
    tip: "",
    datum:"",
    slika:""
  };

  korIme:string = ""; 
  lozinka:string = "";
  poruka: string = "";

  ngOnInit(): void {
    localStorage.setItem('header', "ne");
  }

  login(){
    this.poruka="";
    if(this.korIme==null || this.korIme=="" || this.lozinka==null || this.lozinka=="") {
      this.poruka = "Sva polja su obavezna!";
      return;
    }

    this.https.post<{fleg: boolean, korisnik: any}>('http://localhost:3000/login', {korIme: this.korIme, lozinka: this.lozinka})
      .subscribe( (odg) => {
        if(!odg.fleg){
          this.poruka="Pogresni kredencijali!";
          return;
        }  else {
          let omg = odg;
          this.kor = {
            ime: omg.korisnik.ime,
            prezime: omg.korisnik.prezime,
            korIme: omg.korisnik.korIme,
            lozinka: omg.korisnik.lozinka,
            grad : omg.korisnik.grad,
            drzava: omg.korisnik.drzava,
            mejl: omg.korisnik.mejl,
            tip: omg.korisnik.tip,
            datum: omg.korisnik.datum,
            slika: omg.korisnik.slika
          }
          localStorage.setItem('header', "da");
          
          localStorage.setItem('ulogovani', this.korIme);
          localStorage.setItem('podaci', JSON.stringify(this.kor));
          this.rut.navigate(['/registrovaniKorisnik']);
          
        }
      })
  }

  gost(){
    localStorage.setItem('header', "da");
    localStorage.setItem('ulogovani', "gost");
    localStorage.setItem('podaci', null);
  }

  zab(){
    localStorage.setItem('zaborav', "da");
  }
}

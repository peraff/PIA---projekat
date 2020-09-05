import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'projekat-avgust2020';

  constructor(private rut: Router){}

  moj: string;
  pocetna(){
    this.moj=localStorage.getItem('ulogovani');

    if(localStorage.getItem('header')=="da"){
      if(this.moj=="gost"){
        this.rut.navigate(['/gost']);
      } else {
        this.rut.navigate(['/registrovaniKorisnik']);
      }
    } 
    
    else return;
  }

  odjavi(){
    localStorage.setItem('ulogovani', null);
    localStorage.setItem('podaci', null);
    this.rut.navigate(['']);
  }
}


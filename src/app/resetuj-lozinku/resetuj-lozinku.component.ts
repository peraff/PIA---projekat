import { Component, OnInit } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetuj-lozinku',
  templateUrl: './resetuj-lozinku.component.html',
  styleUrls: ['./resetuj-lozinku.component.css']
})
export class ResetujLozinkuComponent implements OnInit {

  mejl: string="";

  poruka: string="";

  zab:string ="";

  stara: string="";

  nova1: string="";

  nova2: string = "";

  korIme: string="";


  constructor(private https: HttpClient, private rut: Router) { }

  ngOnInit(): void {
    this.zab=localStorage.getItem('zaborav');
    this.korIme=localStorage.getItem('ulogovani');
  }

  
  saljii(){
    if(this.mejl=="" || this.mejl==null) {
      this.poruka="Ovo polje je obavezno!";
      return;
    }

    if(this.mejl == "123" || this.mejl=="asd"){
      this.poruka="Ova e-mail adresa ne postoji u sistemu";
      return;
    }

    this.https.post<{mess: string}>('http://localhost:3000/resetujLozinku', {mejl: this.mejl}).subscribe((odg)=>{
      
      alert(odg.mess);
    });
   
  }


  saljii2(){
    if(this.stara=="" || this.stara==null || this.nova1=="" || this.nova1==null || this.nova2=="" || this.nova2==null) {
      this.poruka="Sva polja su obavezna!";
      return;
    }

    if(this.nova1!= this.nova2) {
      this.poruka="Lozinke se moraju poklapati!";
      return;
    }

    let reg = new RegExp('^[A-Za-z](?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{7,}$');
    
    if(!reg.test(this.nova1)){
      this.poruka="Lozinka mora imati: bar 7 karaktera, veliko i malo slovo, spec karakter i mora pocinjati slovom";
      return;
    }

    this.poruka="";

    this.https.post<{fleg: boolean}>('http://localhost:3000/promeniLozinku', {korIme: this.korIme, lozinka: this.stara, nova: this.nova1}).
    subscribe((odg)=>{
      if(odg.fleg){
        localStorage.setItem('ulogovani', "");
        this.rut.navigate(['']);
      } else {
        this.poruka="Uneta je pogresna lozinka!";
        return;
      }
      
    });

  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Korisnik } from 'src/models/Korisnik';

@Component({
  selector: 'app-nova-lozinka',
  templateUrl: './nova-lozinka.component.html',
  styleUrls: ['./nova-lozinka.component.css']
})
export class NovaLozinkaComponent implements OnInit {

  constructor(private https: HttpClient, private ruter : Router) { }

  ngOnInit(): void {
  }


  lozinka = "";
  potvrda = "";
  poruka="";
  
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



  posalji(){
    if(this.lozinka != this.potvrda){
      this.poruka = "Lozinke se moraju poklapati!";
      return;
    }

    // let reg = new RegExp('^[A-Za-z](?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{7,}$');

    let reg=new RegExp('^[A-Za-z](?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}');
    
    if(!reg.test(this.lozinka)){
      this.poruka="Lozinka mora imati: bar 7 karaktera, veliko i malo slovo, spec karakter i mora pocinjati slovom";
      return;
    }


    this.https.post<{korIme: string}>('http://localhost:3000/sacuvajNovuLozinku',{lozinka: this.lozinka}).subscribe((odg)=>{

      alert('Uspesno promenjena lozinka!');

      this.https.post<{fleg: boolean, korisnik: any}>('http://localhost:3000/login', {korIme:odg.korIme, lozinka: this.lozinka}).subscribe(odg2=>{

        this.kor = {
          ime: odg2.korisnik.ime,
          prezime: odg2.korisnik.prezime,
          korIme: odg2.korisnik.korIme,
          lozinka: odg2.korisnik.lozinka,
          grad : odg2.korisnik.grad,
          drzava: odg2.korisnik.drzava,
          mejl: odg2.korisnik.mejl,
          tip: odg2.korisnik.tip,
          datum: odg2.korisnik.datum,
          slika: odg2.korisnik.slika
        }
        localStorage.setItem('header', "da");
        
        localStorage.setItem('ulogovani', odg.korIme);
        localStorage.setItem('podaci', JSON.stringify(this.kor));
        this.ruter.navigate(['/registrovaniKorisnik']);

      })
    })
  }

}

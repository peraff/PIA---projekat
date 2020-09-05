import { Component, OnInit } from '@angular/core';
import {Korisnik } from '../../models/Korisnik';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private https: HttpClient) { }

  ngOnInit(): void {
  }

  ime="";
  prezime="";
  korIme="";
  lozinka="";
  drzava="";
  grad="";
  datum="";
  potvrda="";
  mejl="";
  poruka="";
  slika;
  

  registracija() {


    // let reg=new RegExp('^[A-Za-z](?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}');

    let reg = new RegExp('^[A-Za-z](?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{7,}$');
    
    if(!reg.test(this.lozinka)){
      this.poruka="Lozinka mora imati: bar 7 karaktera, veliko i malo slovo, spec karakter i mora pocinjati slovom";
      return;
    }

    this.poruka="";

    if( this.ime==null || this.ime=="" ||
        this.prezime==null || this.prezime=="" ||
        this.lozinka==null || this.lozinka=="" ||
        this.korIme==null || this.korIme=="" ||
        this.drzava==null || this.drzava=="" ||
        this.grad==null || this.grad=="" ||
        this.datum==null || this.datum=="" ||
        this.potvrda==null || this.potvrda=="" ||
        this.mejl==null || this.mejl==""
      ) { 
        this.poruka="Sva polja su obavezna";
         return;
      }

      if(this.lozinka !== this.potvrda) {
        this.poruka="Pogresno ponovljena lozinka!";
        return;
      }

      let kor: Korisnik = { 
        ime: this.ime,
        prezime: this.prezime,
        lozinka: this.lozinka,
        korIme: this.korIme,
        drzava: this.drzava,
        grad: this.grad,
        datum: this.datum,
        mejl: this.mejl, 
        tip: "registrovani",
        slika: null
      }

      let zaSlanje = new FormData();
      zaSlanje.append("ime", kor.ime);
      zaSlanje.append('prezime', kor.prezime);
      zaSlanje.append('lozinka', kor.lozinka);
      zaSlanje.append('korIme', kor.korIme);
      zaSlanje.append('drzava', kor.drzava);
      zaSlanje.append('grad', kor.grad);
      zaSlanje.append('datum', kor.datum);
      zaSlanje.append('mejl', kor.mejl);
      zaSlanje.append('tip', kor.tip);
      if(this.slika) zaSlanje.append('slika', this.slika, this.slika.name);

      this.https.post<{por: string}>('http://localhost:3000/registracija', zaSlanje)
      .subscribe((odg)=>{
        alert('Zahtev za registraciju je poslat. Sacekajte odgovor administratora!');
      })


  }


  dodajSliku(e){
    this.slika=e.target.files[0];
    console.log(this.slika.name);
  }
}

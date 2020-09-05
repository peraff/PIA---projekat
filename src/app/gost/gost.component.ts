import { Component, OnInit } from '@angular/core';
import { KorisnickiService } from '../korisnicki.service';
import { NumberValueAccessor } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfilPrikazComponent } from '../profil-prikaz/profil-prikaz.component';
import { Desavanje } from '../Desavanje';

@Component({
  selector: 'app-gost',
  templateUrl: './gost.component.html',
  styleUrls: ['./gost.component.css']
})
export class GostComponent implements OnInit {
  constructor(private https: HttpClient){}

  desss: Desavanje []=[];
  pomocna: Desavanje []=[];
  indexZaIzb: number[] =[];

  ngOnInit(){
    this.https.get<{arg:any}>('http://localhost:3000/dohvatiDesavanja').subscribe(odg=>{
      this.indexZaIzb=[];
      this.desss= []; 
      this.pomocna=JSON.parse(odg.arg);
      this.pomocna.forEach(e => {
        let desa : Desavanje={
          ...e,
          st: false
        }
        this.desss.push(desa);
      });
     let datum: Date = new Date();
      this.desss.forEach((e, index) => {
        let poc=new Date(e.pocetak);
        let kr=new Date(e.kraj);
        if((datum > poc) && (datum < kr)) {
          e.st=true;
        }
        if((datum > poc) && (datum > kr)){
          this.indexZaIzb.push(index);
        }
      });
      for (let i = this.indexZaIzb.length - 1; i >= 0; i--){
        this.desss.splice(this.indexZaIzb[i], 1);
      }
    
    }); 
  }

}

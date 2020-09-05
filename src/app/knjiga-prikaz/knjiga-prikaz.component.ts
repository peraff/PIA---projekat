import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import { HttpClient } from '@angular/common/http';
import { __await } from 'tslib';

@Component({
  selector: 'app-knjiga-prikaz',
  templateUrl: './knjiga-prikaz.component.html',
  styleUrls: ['./knjiga-prikaz.component.css']
})
export class KnjigaPrikazComponent implements OnInit, OnDestroy {

  constructor(private ruta: ActivatedRoute, private https: HttpClient) { }

  //admin menja informacije o knjizi
  izmene = false; 
  izmenjeniZanrovi

  izmeniKnjigu(){
    this.izmene=true;
  }

  azurirajPodatkeKnjige(){
    this.https.post<{mess: string}>('http://localhost:3000/azurirajPodatkeKnjige', {stariNaziv: this.naziv, knjiga: this.mojaKnjiga, zanrovi: this.zanrovi}).subscribe(odg=>{ 
 
      alert('Uspesno ste azurirali podatke knjige! Osvezite da vidite');
    });
  }
  //fleg koji oznacava dal je korisnik zapoceo citanje za ovu konkretnu knjigu
  zapoceo="ne";

  ngOnInit(): void {

    this.zapoceo="ne";
    this.azuriranjeKom=false;

    this.naziv=this.ruta.snapshot.paramMap.get('naziv');
    this.moj=localStorage.getItem('ulogovani');
    this.zapoceo=localStorage.getItem('ppoc');
    
    this.https.post<{arg: any}>('http://localhost:3000/podaciKnjige', {naziv: this.naziv}).subscribe(odg=>{ 
        this.mojaKnjiga=odg.arg;
        this.zanrovi=JSON.parse(this.mojaKnjiga.zanroviK);
      
    });

    //dohvata sve komentare za ovu knjigu i racuna prosecnu ocenu

    this.https.post<{arg:any}>('http://localhost:3000/dohvatiKomentareZaKnjigu', {naziv: this.naziv}).subscribe(odg=>{ 
        this.komentari=JSON.parse(odg.arg);
        let n=0;
        this.komentari.forEach(e => {
          if(e.korisnik == this.moj){
            this.ocenica=e.ocena;
            this.komentar=e.komentar;
            this.azuriranjeKom=true;
          }
          this.prosecnaOcena+=e.ocena;
          n++;
        });
        if(n!=0){
          this.prosecnaOcena/=n;
          this.prosecnaOcena=Number(this.prosecnaOcena.toFixed(1));
        } else this.prosecnaOcena=0;
    });

    if(this.moj!="gost" && this.zapoceo == "da"){
    this.https.post<{procitao: number, ukupno:number }>('http://localhost:3000/podaciOCitanju', {naziv: this.naziv, korisnik: this.moj}).subscribe(odg=>{ 
      this.procitao=odg.procitao;
      this.ukupno=odg.ukupno;
      if(this.ukupno==0 || this.ukupno==null) this.postignuce=0;
      else{
        this.postignuce=this.procitao/this.ukupno * 100;
        this.postignuce=Number(this.postignuce.toFixed(1));
      }
     
      localStorage.setItem('ppoc', "ne");
  });
  }
  }

  postignuce:number;
  procitao:number;
  ukupno: number;
  zanrovi;
  naziv: string="";
  mojaKnjiga : any;
  moj="";

  procitana(){
    this.https.post<{mess: string}>('http://localhost:3000/procitana', {naziv: this.naziv, korisnik: this.moj, zanrovi: this.mojaKnjiga.zanroviK}).subscribe(odg=>{
      alert(odg.mess);
    });
  }

  zapocniCitanje(){
    this.https.post<{mess: string}>('http://localhost:3000/zapocniCitanje', {naziv: this.naziv, korisnik: this.moj}).subscribe(odg=>{
      alert(odg.mess);
    });
  }

  staviNaListu(){

  }

  ukloniSaListe(){

  }


  azurirajPB(){
    if(this.ukupno==0 || this.ukupno==null) this.postignuce= 0;
    else{
      this.postignuce=this.procitao/this.ukupno * 100;
      this.postignuce=Number(this.postignuce.toFixed(1));
    }
 
  }


  /* ********************************************** Komentar *********************************************************** */
  komentar: string="";
  ocenica: number;
  prosecnaOcena: number=0;
  komentari:any []=[];
  azuriranjeKom: boolean=false;


  tudjiProfil(k){
    localStorage.setItem('tudji', k);
  }

  unesiKomentar(){
    if(this.ocenica<1 || this.ocenica>10){
      alert('Ocena mora biti od 1 do 10!');
      return;
    }
    if(!this.azuriranjeKom){
      this.https.post<{mess: string}>('http://localhost:3000/unesiKomentar', {naziv: this.naziv, korisnik: this.moj, komentar: this.komentar, ocena: this.ocenica, autori:this.mojaKnjiga.autoriK})
      .subscribe(odg=>{
        alert(odg.mess);
      });
    } else{
        this.https.post<{mess: string}>('http://localhost:3000/azurirajKomentar', {naziv: this.naziv, korisnik: this.moj, komentar: this.komentar, ocena: this.ocenica})
        .subscribe(odg=>{
          alert(odg.mess);
        });
    }
  
  }

  ngOnDestroy(){
    if(this.procitao!=0 && this.ukupno!=0 && this.procitao!=null && this.ukupno!=null && this.procitao!=undefined && this.ukupno!=undefined){
      this.https.post('http://localhost:3000/azuriranPB', {naziv: this.naziv, korisnik: this.moj, procitao: this.procitao, ukupno: this.ukupno})
      .subscribe(odg=>{

      });
    }
  }


}

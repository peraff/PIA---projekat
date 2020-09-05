import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Korisnik } from 'src/models/Korisnik';
import { HttpClient } from '@angular/common/http';
import { KorisnickiService } from '../korisnicki.service';
import { Desavanje } from '../Desavanje';

@Component({
  selector: 'app-registrovani-korisnik',
  templateUrl: './registrovani-korisnik.component.html',
  styleUrls: ['./registrovani-korisnik.component.css']
})
export class RegistrovaniKorisnikComponent implements OnInit {

  constructor(private rut: Router, private https: HttpClient, private korisnickiServis: KorisnickiService, private ref: ChangeDetectorRef, private ruta: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.moj = localStorage.getItem('ulogovani');
    this.korisnik = JSON.parse(localStorage.getItem('podaci'));
    localStorage.setItem('ppoc', "ne");  //setujem fleg za podatke knjige - izmeni ovo samo dodaj http zahtev u prikazu knjige koji proverava dal se knjiga trenutno cita


    this.slika= this.korisnik.slika; //bukvalno nbtno samo da bih uzeo sliku

    this.zanrovi=this.korisnickiServis.dohvatiZanrove();

    this.dodavanjeKnjige=false; //resetujem fleg da se sakrije komponenta za dodavanje 

    this.https.get<{arg:any}>('http://localhost:3000/sveKnjige')  //dohvatam sve knjige iz baze, da bih mogao da ih pretrazujem i prikazem moderatoru
      .subscribe((odg)=>{
        this.sveKnjige = JSON.parse(odg.arg);
        if(this.korisnik.tip=="moderator"){
          this.sveKnjige.forEach(e => {
            if(!e.odobrena) this.noveKnjige.push(e);
          });
        }
    });
   
    this.https.post<{arg:any}>('http://localhost:3000/procitane', {korisnik: this.moj}).subscribe(odg=>{

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


    this.https.post<{arg:any}>('http://localhost:3000/trenutnoCita', {korisnik: this.moj}).subscribe(odg=>{
      this.trenutnoCita=JSON.parse(odg.arg);
    });

    this.https.post<{arg:any}>('http://localhost:3000/dohvatiKomentareZaKorisnika', {korisnik: this.moj}).subscribe(odg=>{
      this.mojiKomentari = JSON.parse(odg.arg);
    });

    // dohvatanje svih desavanja i odabir samo aktivnih i buducih
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

  //ako se klikne na knjigu koja se trenutno cita ovaj fleg se setuje u localStorage
  podesiCitanje(){
    localStorage.setItem('ppoc', "da");
  }

  //desavanja
  desss: Desavanje []=[];
  pomocna: Desavanje []=[];
  indexZaIzb: number[] =[];

  //prikaz komentara na profilu
  mojiKomentari: any[]=[];

  //moderator
  noveKnjige: any [] = [];
  sveKnjige: any[]=[];
  procitaneKnjige: any []=[];
  trenutnoCita: any []=[];

  //podaci za azuriranje profila
  izmena: boolean=false;
  slika="";
  korisnik: Korisnik;
  moj: string="";
  novaSlika;

  //podaci za dodavanje nove knjige
  dodavanjeKnjige: boolean= false;
  nazivK="";
  autoriK="";
  datumK="";
  opisK="";
  zanrovi:string[]=[];
  izabraniZanrovi: string[] = [];
  slikaKnjige;

  odjavi(){
    localStorage.setItem('ulogovani', "");
    this.rut.navigate([""]);
  }

  promeniLozinku(){
    localStorage.setItem('zaborav', "ne");
    this.rut.navigate(['/resetujLozinku'])
  }

  izmeniPod(){
    //sacuvaj izmene!
      let zaSlanje = new FormData();
      zaSlanje.append("ime", this.korisnik.ime);
      zaSlanje.append('prezime', this.korisnik.prezime);
      zaSlanje.append('drzava', this.korisnik.drzava);
      zaSlanje.append('grad', this.korisnik.grad);
      zaSlanje.append('datum', this.korisnik.datum);
      zaSlanje.append('mejl', this.korisnik.mejl);
      zaSlanje.append('korIme', this.moj)
      if(this.novaSlika) zaSlanje.append('slika', this.novaSlika, this.novaSlika.name);

      this.https.post('http://localhost:3000/izmeniPodatke', zaSlanje)
      .subscribe(()=>{
        alert('Vasi podaci su uspesno izmenjeni! Ulogujte se ponovo da biste videli sve promene!');
      })

    this.novaSlika=null;
    this.izmena=false;
  }

  iz(){
    this.izmena=true;
  }

  dodajSliku(e){
    this.novaSlika=e.target.files[0];
  }

  dodajKnjigu(){
    this.dodavanjeKnjige=true;
  }

  posaljiKnjigu(){
    //saljem podatke o novoj knjizi na server u bazu!
    let zaSlanje = new FormData();
      zaSlanje.append("nazivK", this.nazivK );
      zaSlanje.append('autoriK', this.autoriK);
      zaSlanje.append('datumK', this.datumK);
      zaSlanje.append('zanroviK', JSON.stringify(this.izabraniZanrovi));
      zaSlanje.append('opisK', this.opisK);

     // zaSlanje.append('korIme', this.moj)
      if(this.slikaKnjige) zaSlanje.append('slikaKnjige', this.slikaKnjige, this.slikaKnjige.name);

      this.https.post('http://localhost:3000/dodajKnjigu', zaSlanje)
      .subscribe(()=>{
        alert('Uspesno ste dodali novu knjigu! Sacekajte odobrenje moderatora.');
        this.slikaKnjige=null;
        this.dodavanjeKnjige=false;
      })
  }

  dodajSlikuKnjige(e){
    this.slikaKnjige=e.target.files[0];
  }

  prihvatiKnjigu(k){
    this.https.post('http://localhost:3000/prihvatiKnjigu', k)
    .subscribe(()=>{
      this.noveKnjige.forEach((e, index) => {
        if(e.nazivK==k.nazivK) this.noveKnjige.splice(index,1);
      });
    })
  }

  odbijKnjigu(k){
    this.https.post('http://localhost:3000/odbijKnjigu', k)
    .subscribe(()=>{
      this.noveKnjige.forEach((e, index) => {
        if(e.nazivK==k.nazivK) this.noveKnjige.splice(index,1);
      });
    })
  }



  /* **************************************************************************************************
  *****************************************************************************************************
  Dodavanje nove knjige sa sve poljima
  ******************************************************
  ******************************************************/

 naziv="";
 autori: string;
 zanr: string[]=[];


 knjige: any[] = [];

 ocena: number=5;

 pretrazeno: boolean = false;

 pretraga(){
   this.pretrazeno=true;
   this.korisnickiServis.nadjiKnjigu(this.naziv, this.autori, this.zanr).subscribe(odg=>{
     if(odg.arg){
       this.knjige = JSON.parse(odg.arg);
     }
     else this.knjige = [];
   });
 }

 @ViewChild("dodo") polje: ElementRef;

 dodajKnjigu2() {
  this.dodavanjeKnjige=true;
  this.ref.detectChanges();
  this.scrollisa();
 }
 scrollisa(){
  this.polje.nativeElement.scrollIntoView({ behavior: "smooth", block: "center" });
 }

 //pie chart

 pieChartData:number[]=[];
 pieChartLabels: string[]=[];
 public mojeBoje: Array<any> = [
  {
    backgroundColor: ['#F7464A', '#46BFBD','#800080', '#ffd700', '#008000'],
    hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#9932cc',  '#daa520', '#adff2f'],
  }
];
}

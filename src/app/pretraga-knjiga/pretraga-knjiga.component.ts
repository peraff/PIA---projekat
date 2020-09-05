import { Component, OnInit } from '@angular/core';
import { KorisnickiService } from '../korisnicki.service';

@Component({
  selector: 'app-pretraga-knjiga',
  templateUrl: './pretraga-knjiga.component.html',
  styleUrls: ['./pretraga-knjiga.component.css']
})
export class PretragaKnjigaComponent implements OnInit {

  constructor( private mojServis: KorisnickiService) { }

  ngOnInit(): void {
    this.zanrovi=this.mojServis.dohvatiZanrove();
    this.moj = this.mojServis.dohvatiUlogovanog();
    console.log(this.moj)
  }

  moj="";
  naziv="";
  autori: string;
  zanr: string[]=[];

  zanrovi: string[]=[];

  knjige: any[] = [];

  ocena: number=5;

  pretrazeno=false;

  pretraga(){
    this.pretrazeno=true;
    this.mojServis.nadjiKnjigu(this.naziv, this.autori, this.zanr).subscribe(odg=>{
      if(odg.arg){
        this.knjige = JSON.parse(odg.arg);
      }
      else this.knjige = [];
    });
  }

}

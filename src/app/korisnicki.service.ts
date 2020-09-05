import { Injectable } from '@angular/core';
import { ZANROVI } from 'src/podaci/ZANROVI';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KorisnickiService {

  constructor(private https: HttpClient) { }

  dohvatiZanrove(): string[]{
    if (!localStorage.getItem('zanrovi')){
      localStorage.setItem('zanrovi', JSON.stringify(this.zanrovi))
    }
    return JSON.parse(localStorage.getItem('zanrovi'));
  }

  zanrovi= ZANROVI;


dohvatiUlogovanog(): string {
if(localStorage.getItem('ulogovani') == "gost") return "gost";
else return JSON.parse(localStorage.getItem('podaci')).tip;

}

  nadjiKnjigu(naziv:string, autori: string, zanr:string[]): Observable<any>{

    return this.https.post('http://localhost:3000/nadjiKnjigu', {naziv:naziv, autori: autori, zanr: JSON.stringify(zanr)});
  }
}

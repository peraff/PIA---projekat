import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { RegistrovaniKorisnikComponent } from './registrovani-korisnik/registrovani-korisnik.component';
import { GostComponent } from './gost/gost.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { ResetujLozinkuComponent } from './resetuj-lozinku/resetuj-lozinku.component';
import { NovaLozinkaComponent } from './nova-lozinka/nova-lozinka.component';
import { PretragaKnjigaComponent } from './pretraga-knjiga/pretraga-knjiga.component';
import { KnjigaPrikazComponent } from './knjiga-prikaz/knjiga-prikaz.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ChartsModule } from 'ng2-charts';
import { ProfilPrikazComponent } from './profil-prikaz/profil-prikaz.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistracijaComponent,
    AdministratorComponent,
    RegistrovaniKorisnikComponent,
    GostComponent,
    ModeratorComponent,
    ResetujLozinkuComponent,
    NovaLozinkaComponent,
    PretragaKnjigaComponent,
    KnjigaPrikazComponent,
    ProfilPrikazComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
    ChartsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

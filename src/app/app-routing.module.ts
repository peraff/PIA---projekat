import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { RegistrovaniKorisnikComponent } from './registrovani-korisnik/registrovani-korisnik.component';
import { GostComponent } from './gost/gost.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { ResetujLozinkuComponent } from './resetuj-lozinku/resetuj-lozinku.component';
import { NovaLozinkaComponent } from './nova-lozinka/nova-lozinka.component';
import { KnjigaPrikazComponent } from './knjiga-prikaz/knjiga-prikaz.component';
import { ProfilPrikazComponent } from './profil-prikaz/profil-prikaz.component';


const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'registracija', component: RegistracijaComponent},
  {path: 'admin', component: AdministratorComponent},
  {path: 'registrovaniKorisnik', component: RegistrovaniKorisnikComponent},
  {path: 'gost', component:GostComponent},
  {path: 'moderator', component: RegistrovaniKorisnikComponent},
  {path: 'resetujLozinku', component:ResetujLozinkuComponent},
  {path: 'novaLozinka', component:NovaLozinkaComponent},
  {path: 'knjiga/:naziv', component: KnjigaPrikazComponent},
  {path: 'profilPrikaz', component: ProfilPrikazComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

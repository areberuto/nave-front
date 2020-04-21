import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FenomenosComponent } from './components/fenomenos/fenomenos.component';
import { FormFenomenosComponent } from './components/form-fenomenos/form-fenomenos.component';
import { LoginComponent } from './components/login/login/login.component';
import { InvestigadoresComponent } from './components/investigadores/investigadores.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  { 
    path: "profile",
    component: ProfileComponent
  },
  {
    path: "fenomenos",
    component: FenomenosComponent
  },
  {
    path: "fenomenos/inv/:seeInv",
    component: FenomenosComponent
  },
  {
    path: "investigadores",
    component: InvestigadoresComponent
  },
  {
    path: "addFenomeno",
    component: FormFenomenosComponent
  },
  {
    path: "modFenomeno/:idFen",
    component: FormFenomenosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

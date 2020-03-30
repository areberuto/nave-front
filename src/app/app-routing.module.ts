import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FenomenosComponent } from './components/fenomenos/fenomenos.component';
import { FormFenomenosComponent } from './components/form-fenomenos/form-fenomenos.component';
import { LoginComponent } from './components/login/login/login.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "fenomenos",
    component: FenomenosComponent
  },
  {
    path: "view/:id/fenomenos",
    component: FenomenosComponent
  },
  {
    path: "view/:id/addFenomeno",
    component: FormFenomenosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FenomenosComponent } from './components/fenomenos/fenomenos.component';
import { FormFenomenosComponent } from './components/form-fenomenos/form-fenomenos.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login/login.component';
import { InvestigadoresComponent } from './components/investigadores/investigadores.component';
import { AuthInterceptor } from './services/interceptors/auth-interceptor.service';
import { MapaComponent } from './components/mapa/mapa/mapa.component';

@NgModule({
  declarations: [
    AppComponent,
    FenomenosComponent,
    FormFenomenosComponent,
    HeaderComponent,
    NavComponent,
    LoginComponent,
    InvestigadoresComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

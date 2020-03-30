import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FenomenosComponent } from './components/fenomenos/fenomenos.component';
import { FormFenomenosComponent } from './components/form-fenomenos/form-fenomenos.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    FenomenosComponent,
    FormFenomenosComponent,
    HeaderComponent,
    NavComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { Observable, Observer, onErrorResumeNext } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public emailLogin: string;
  public clave: string;
  public loginIncorrecto: boolean;
  public observableDePrueba: Observable<any>;

  constructor(private investigadoresService: InvestigadoresService, private router: Router) { 

    this.emailLogin = "";
    this.clave = "";
    this.loginIncorrecto;

  }

  ngOnInit(): void {


  }

  checkLogin(){

    this.investigadoresService.checkLogin(this.emailLogin, this.clave).subscribe(
      data => {

        console.log(data);
        if(!(data['login'])){

          this.loginIncorrecto = true;

        } else {
          
          this.router.navigate([`/view/${data['id']}/fenomenos`]);

        }

      },
      err => console.log('Error en el login', err)
    );

  }

  
}

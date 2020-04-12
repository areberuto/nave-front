import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public emailLogin: string;
  public clave: string;
  public loginIncorrecto: boolean;

  constructor(private loginService: LoginService, private router: Router) { 

    this.emailLogin = "";
    this.clave = "";
    this.loginIncorrecto = false;

  }

  ngOnInit() {

    //Reseteo del estado del login cada vez que se entra a esta pantalla

    this.loginService.setLoginStatus({isAdmin: false, idInv: undefined});
    this.loginService.logOut();
        
  }

  checkLogin(){

    let hashedClave = CryptoJS.SHA3(this.clave).toString();

    this.loginService.checkLogin(this.emailLogin, hashedClave).subscribe(

      data => {
        
        this.loginService.setSession(data);
        
        this.loginService.setLoginStatus({

          isAdmin: false,
          idInv: data['idInv']

        });

        this.router.navigate(['/fenomenos']);
        
      },

      err => {

        this.loginIncorrecto = true;
        console.log(`Error en el login.`);
        console.log(err);

      }

    );

  }

  loginPublico(event: Event){

    event.preventDefault();
    this.loginService.setLoginStatus({isAdmin: false, idInv: -1});
    this.router.navigate(['/fenomenos']);

  }
  
}

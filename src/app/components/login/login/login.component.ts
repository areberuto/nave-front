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

  public emailLogin: String;
  public emailOlvidada: String;
  public clave: String;
  public loginIncorrecto: Boolean;
  public mostrarOlvidada: Boolean;

  constructor(private loginService: LoginService, private router: Router) { 

    this.emailLogin = "";
    this.emailOlvidada = "";
    this.clave = "";
    this.loginIncorrecto = false;
    this.mostrarOlvidada = false;

  }

  ngOnInit() {

    if(location.href.indexOf('codGen') != -1){

      this.verify();

    }

    if(location.href.indexOf('tmpClave') != -1){

      this.resetPwd();

    }

    //Reseteo del estado del login cada vez que se entra a esta pantalla
    this.loginService.setLoginStatus({isAdmin: false, idInv: undefined});
    this.loginService.logOut();
        
  }

  verify(){

    const url = location.href;
    const codGen = url.substring(url.indexOf("=") + 1);
    console.log(codGen);

    this.loginService.verify(codGen).subscribe(data => {
      
      console.log(data);
      alert("Verificación realizada con éxito. ¡Ya puedes usar la plataforma!")
      
    }, err => {

      alert("Algo ha ido mal a la hora de verificar tu cuenta. Vuelve a intentarlo o contacta con el administrador.")
      console.log("Ha ocurrido un error:", err);
      
    });

  }

  checkLogin(){

    const hashedClave = CryptoJS.SHA3(this.clave).toString();

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
  
  mailOlvidada(){

    this.loginService.pwOlvidada(this.emailOlvidada).subscribe(data => {

      alert("Comprueba la bandeja de entrada del correo electrónico.");

    }, err => {

      alert(err.error);
      console.log("Error:", err);

    });

  }

  resetPwd(){

    const url = location.href;
    const tmpClave = url.substring(url.indexOf("tmpClave=") + "tmpClave=".length);
    const tmpClaveSHA = CryptoJS.SHA3(tmpClave).toString();

    console.log(tmpClave);
    console.log(tmpClaveSHA);

    this.loginService.resetPwd(tmpClave, tmpClaveSHA).subscribe(data => {
      
      alert("Tu clave ha sido actualizada. Te aconsejamos cambiarla cuanto antes en Mi perfil.");
      
    }, err => {

      alert("Algo ha ido mal a la hora de regenerar tu clave. Vuelve a intentarlo o contacta con el administrador.")
      console.log("Ha ocurrido un error:", err);
      
    });

  }
}

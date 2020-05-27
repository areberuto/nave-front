import { Component, OnInit } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { LoginService } from 'src/app/services/login/login.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public investigador: Investigador;

  constructor(private loginService: LoginService, private router: Router) { 

    this.investigador = <Investigador>{};

  }

  ngOnInit(): void {
  }

  signUp(){

    let submitInvestigador = JSON.parse(JSON.stringify(this.investigador));
    submitInvestigador.clave = CryptoJS.SHA3(submitInvestigador.clave).toString();

    console.log('Registrando este investigador:', submitInvestigador);

    this.loginService.registerInvestigador(submitInvestigador).subscribe(data => {

      alert('Registro realizado con éxito. Por favor, dirígite a tu email para verificar tu cuenta.');
      this.router.navigate(['/']);

    }, err => {

      console.log(err);

    });

  }

  verPassword(){

    document.getElementById('clave').setAttribute('type', 'text');

  }

  ocultarPassword(){

    document.getElementById('clave').setAttribute('type', 'password');

  }

  fileUpload(event){

    console.log(event.target.files);

  }

}

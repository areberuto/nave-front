import { Component, OnInit } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { LoginService } from 'src/app/services/login/login.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public investigador: Investigador;
  public correoExiste: Boolean;
  public claveControl: String;

  constructor(private loginService: LoginService, private investigadoresService: InvestigadoresService, private router: Router) {

    this.investigador = <Investigador>{};
    this.correoExiste = false;
    this.claveControl = "";

  }

  ngOnInit(): void {
  }

  signUp() {

    const submitInvestigador = JSON.parse(JSON.stringify(this.investigador));
    submitInvestigador.clave = CryptoJS.SHA3(submitInvestigador.clave).toString();

    console.log('Registrando este investigador:', submitInvestigador);

    this.loginService.registerInvestigador(submitInvestigador).subscribe(data => {

      alert('Registro realizado con éxito. Por favor, dirígite a tu email para verificar tu cuenta.');
      this.router.navigate(['/']);

    }, err => {

      console.log(err);

    });

  }

  verPassword(event) {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "text");

  }

  ocultarPassword(event) {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "password");

  }

  fileUpload(event) {

    console.log(event.target.files);

  }

  comprobarDisponibilidad() {

    this.investigadoresService.getInvestigadorByEmail(this.investigador.correo).subscribe(investigador => {

      if (!Object.keys(investigador).length) {

        setTimeout(() => this.correoExiste = false, 500);

      } else {

        setTimeout(() => this.correoExiste = true, 500);

      }

    }, err => {

      console.log(err);

    });

  }

}

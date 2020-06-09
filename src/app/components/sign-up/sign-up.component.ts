import { Component, OnInit } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { LoginService } from 'src/app/services/login/login.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public investigador: Investigador;
  public correoExiste: Boolean;
  public claveControl: String;
  public preview: HTMLImageElement;
  public avatarOk: Boolean;
  private reader: FileReader;

  constructor(private loginService: LoginService, private investigadoresService: InvestigadoresService, private router: Router) {

    this.investigador = <Investigador>{};
    this.investigador.genero = 1;
    this.correoExiste = false;
    this.claveControl = "";
    this.preview = new Image();
    this.avatarOk = false;
    this.reader = new FileReader();


  }

  ngOnInit(): void {

    this.reader.onload = (e) => {

      this.avatarOk = false;
      this.preview.src = <string>e.target.result;

    }

    this.preview.onload = () => {

      console.log(this.preview.width, this.preview.height);

      if(this.preview.width != this.preview.height){

        alert("La imagen debe ser cuadrada.");
        this.preview.src = undefined;

      } else{

        this.preview.width, this.preview.height = 200;
        this.avatarOk = true;

      }

    }

  }

  signUp(): void {
    
    const submitInvestigador: Investigador = JSON.parse(JSON.stringify(this.investigador));
    submitInvestigador.clave = CryptoJS.SHA3(submitInvestigador.clave).toString();

    console.log('Registrando este investigador:', submitInvestigador);

    this.loginService.registerInvestigador(submitInvestigador).subscribe(data => {

      alert('Registro realizado con éxito. Por favor, dirígite a tu email para verificar tu cuenta.');
      this.router.navigate(['/']);

    }, err => {

      console.log(err);

    });

  }

  verPassword(event: any): void {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "text");

  }

  ocultarPassword(event: any): void {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "password");

  }

  fileUpload(event: any): void {

    console.log(event.target.files);

    const file = event.target.files[0];

    console.log(file.type);

    if(file.type != "image/png" && file.type != "image/jpeg"){

      alert("Formatos aceptados: png, jpeg.");

    }

    if(file.size > 1000000){

      alert("Tamaño máximo permitido: 1 MB.");

    }

    this.reader.readAsDataURL(file);
  
  }

  comprobarDisponibilidad(): void {

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

import { Component, OnInit, Input, Output } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input() idInvestigador: Number;
  public logAction: String;
  public investigador: Investigador;
  public listaSaludos: String[];
  public saludo: String;

  @Output() verMisFenomenos = new EventEmitter();

  constructor(private investigadoresService: InvestigadoresService) { 

    this.listaSaludos = ['¿Cómo estás?', 'Nos alegra tenerte de vuelta.', '¿Tienes novedades?', '¡A investigar!'];
    this.saludo = this.listaSaludos[Math.floor(Math.random() * this.listaSaludos.length)];

  }

  ngOnInit(): void {
    
    if(this.idInvestigador == -1){

      this.logAction = "Log in";
      document.querySelector("#log").classList.add("btn-success");

    } else {

      this.logAction = "Log out";
      document.querySelector("#log").classList.add("btn-danger");
      this.investigadoresService.getInvestigadorById(this.idInvestigador).subscribe(investigador => {

        this.investigador = investigador;

      }, err => {

        console.log(err);

      });

    }

  }

  mostrarMisFenomenos(){

    this.verMisFenomenos.emit(this.idInvestigador);

  }

}

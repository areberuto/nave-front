import { Component, OnInit} from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';
import { LoginStatus } from 'src/app/models/login/login-status';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {

  public logAction: String;

  public investigador: Investigador;

  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;

  public isMenuCollapsed: Boolean;

  constructor(private investigadoresService: InvestigadoresService, private loginService: LoginService, private router: Router) {   
    
    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
    this.isMenuCollapsed = true;

  }

  ngOnInit(): void {
    
    //Al iniciar el componente, nos suscribimos al observable del estado del login.
    //En cuanto se haga login, se emitirá un objeto con el estado del login y se procede a renderizar
    //el nav según lo que contenga.

    this.loginStatus$.subscribe(data => {
      
      console.log('Recibiendo loginStatus en nav:', data);
      
      this.loginStatus = data;

      if(this.loginStatus.idInv == -1){

        this.logAction = "Log in";
        this.investigador = undefined;
  
      } else if (this.loginStatus.idInv > -1) {
  
        this.logAction = "Log out";
        this.investigadoresService.getInvestigadorById(this.loginStatus.idInv).subscribe(investigador => {
  
          this.investigador = investigador;
  
        }, err => {
  
          console.log(err);
  
        });
  
      }

    });

  }

  toggle(event){

    event.preventDefault();
    
    let boton = document.querySelector(".navbar-toggler");
    
    this.isMenuCollapsed = !this.isMenuCollapsed;

    if(this.isMenuCollapsed) {

      boton.innerHTML = "&#9776;";

    } else {

      boton.innerHTML = "&#9747;";

    }

  }

}

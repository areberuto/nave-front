import { Component, OnInit } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { LoginStatus } from 'src/app/models/login/login-status';
import { Observable } from 'rxjs';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-investigadores',
  templateUrl: './investigadores.component.html',
  styleUrls: ['./investigadores.component.css']
})
export class InvestigadoresComponent implements OnInit {

  public investigadores: Array<Investigador>;

  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService) { 

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();

  }

  ngOnInit(): void {

    //Suscripción para futuros cambios del loginStatus

    this.loginStatus$.subscribe(data => {

      this.loginStatus = data;

    });

    //Si la idInv está a undefined, estamos en el escenario de:

    //- Haber escrito la URL manualmente
    //- Haber refrescado la página

    if(!this.loginStatus.idInv){

      //Si tenemos un token en el storage, es que hemos refrescado la página y
      //antes habíamos hecho login. Procedemos a intentar refrescar permisos.

      if(sessionStorage.getItem('idToken')){

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe( data => {
  
            //Para guardar el nuevo token, que tendrá tiempos de
            //expedición y expiración diferentes.       
            
            this.loginService.setSession(data);
  
            //Seteamos el login y actualizamos los suscriptores del loginStatus$
  
            this.loginService.setLoginStatus({isAdmin: data['isAdmin'], idInv: data['idInv']});
              
          },

          (err) => {
  
            //Si no es válida, devolvemos el error.
  
            console.log(err);

          }

        );

      } 
      
      //Si tampoco tenemos token, por defecto establecemos el estado a público
      //y lo seteamos en el servicio para que el nav lo reciba.

      else {

        this.loginService.setLoginStatus({isAdmin: false, idInv: -1}); 

      }

    }

    this.getInvestigadores();
    
  }

  getInvestigadores() {

    this.investigadoresService.getInvestigadores().subscribe(data => {

      setTimeout(() => this.investigadores = data, 2000);

    }, err => {

      console.log(err);

    });

  }

}

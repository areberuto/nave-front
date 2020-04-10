import { Component, OnInit } from '@angular/core';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginStatus } from 'src/app/models/login/login-status';
import { LoginService } from 'src/app/services/login/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-fenomenos',
  templateUrl: './form-fenomenos.component.html',
  styleUrls: ['./form-fenomenos.component.css']
})
export class FormFenomenosComponent implements OnInit {

  public accion: String = 'Añadir fenómeno';
  public fenomeno: Fenomeno;
  public investigadorId: Number;
  public fenomenoId: Number;

  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  
  constructor(private fenomenosService: FenomenosService, private loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute) { 

    this.fenomeno = <Fenomeno>{};

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();

    if(this.activatedRoute.snapshot.params['idFen']){

      this.fenomenoId = this.activatedRoute.snapshot.params['idFen'];
      this.accion = 'Modificar fenómeno';
      this.fenomenosService.getFenomenoById(this.fenomenoId).subscribe(data => {

        if(data.investigadorId != this.loginStatus.idInv){

          alert('No tienes permisos para editar este fenómeno.');
          this.router.navigate(['/']);

        }

        this.fenomeno = data;
        console.log(this.fenomeno);

      }, err => {

        console.log(err);

      });

    }

  }

  ngOnInit(): void {

    console.log('loginStatus inicial del form:', this.loginStatus);

    //Suscripción para futuros cambios del loginStatus

    this.loginStatus$.subscribe(data => {

      console.log('Actualizando loginStatus en form a:', data);
      this.loginStatus = data;

    });

    //Si la idInv está a undefined, estamos en el escenario de:

    //- Haber escrito la URL manualmente
    //- Haber refrescado la página

    if(!this.loginStatus.idInv){

      //Si tenemos un token en el storage, es que hemos refrescado la página y
      //antes habíamos hecho login. Procedemos a intentar refrescar permisos.

      if(sessionStorage.getItem('idToken')){

        console.log('Hay token en la sessionStorage.');

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe( data => {
  
            //Para guardar el nuevo token, que tendrá tiempos de
            //expedición y expiración diferentes.       
            
            this.loginService.setSession(data);
  
            //Seteamos el login y actualizamos los suscriptores del loginStatus$
  
            this.loginService.setLoginStatus({isAdmin: data['isAdmin'], idInv: data['idInv']});
  
            this.investigadorId = this.loginStatus.idInv;

            console.log('Estado del login actualizado en el form, con la info del usuario', data['idInv']);
            
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

        console.log('No hay token. Pasamos a vista público.');
        this.loginService.setLoginStatus({isAdmin: false, idInv: -1}); 

      }

    //Si no está a undefined, estaba navegando ya como usuario o público, así que cogemos la idInv de antes.

    } else {

      this.investigadorId = this.loginStatus.idInv;

    }

    //Si se intenta acceder a esta vista, manualmente, sin tener un idInv de usuario,
    //te devuelve al login

    if(this.loginStatus.idInv == -1){

      this.router.navigate(['/']);

    }

  }

  addFenomeno(){

    this.fenomeno.investigadorId = this.investigadorId;

    this.fenomenosService.postFenomeno(this.fenomeno).subscribe(data => {

      console.log(data);

      this.router.navigate(['/fenomenos']);

    }, err => {

      console.log(err);

    });

  }

  modFenomeno(){

    this.fenomenosService.putFenomeno(this.fenomeno).subscribe(data => {

      console.log(data);
      
      this.router.navigate(['/fenomenos']);

    }, err => {

      console.log(err);

    });

  }
  
  ejecutarAccion(){

    if(!this.fenomenoId){

      this.addFenomeno();

    } else {

      this.modFenomeno();

    }

  }
}

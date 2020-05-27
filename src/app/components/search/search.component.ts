import { Component, OnInit } from '@angular/core';
import { SearchTarget } from 'src/app/models/search-target/search-target';
import { LoginService } from 'src/app/services/login/login.service';
import { LoginStatus } from 'src/app/models/login/login-status';
import { Observable } from 'rxjs';
import { Investigador } from 'src/app/models/investigador/investigador';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchTarget: SearchTarget;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  public investigadores: Investigador[];

  constructor(private router: Router, private loginService: LoginService, private investigadoresService: InvestigadoresService) {

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
    this.searchTarget = <SearchTarget>{};

  }

  ngOnInit(): void {

    //Suscripción para futuros cambios del loginStatus

    this.loginStatus$.subscribe((data) => {

      this.loginStatus = data;

    });

    //Si la idInv está a undefined, estamos en el escenario de:

    //- Haber escrito la URL manualmente
    //- Haber refrescado la página

    if (!this.loginStatus.idInv) {

      //Si tenemos un token en el storage, es que hemos refrescado la página y
      //antes habíamos hecho login. Procedemos a intentar refrescar permisos.

      if (sessionStorage.getItem("idToken")) {

        this.loginService
          .refreshAuth(
            sessionStorage.getItem("email"),
            sessionStorage.getItem("hashedPass")
          )
          .subscribe(
            (data) => {

              //Para guardar el nuevo token, que tendrá tiempos de
              //expedición y expiración diferentes.

              this.loginService.setSession(data);

              //Seteamos el login y actualizamos los suscriptores del loginStatus$

              this.loginService.setLoginStatus({
                isAdmin: data["isAdmin"],
                idInv: data["idInv"],
              });

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

        this.loginService.setLoginStatus({ isAdmin: false, idInv: -1 });

      }

    }
    
    this.cargarNombres();

  }

  cargarNombres(){

    this.investigadoresService.getInvestigadores().subscribe( data => {

      this.investigadores = data;

    }, err => {

      console.log(err);

    });

  }

  buscar() {

    console.log(this.searchTarget);
    let extras: NavigationExtras = {queryParams: {idInv: this.searchTarget.idInv, ciudad: this.searchTarget.ciudad, pais: this.searchTarget.pais, fechaInicio: this.searchTarget.fechaInicio, fechaFin: this.searchTarget.fechaFin, texto: this.searchTarget.texto}};

    this.router.navigate([`/fenomenos`], extras);

  }

}

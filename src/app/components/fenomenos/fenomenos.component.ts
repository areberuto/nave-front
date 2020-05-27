import { Component, OnInit } from "@angular/core";
import { Fenomeno } from "src/app/models/fenomeno/fenomeno";
import { FenomenosService } from "src/app/services/fenomenos/fenomenos.service";
import { InvestigadoresService } from "src/app/services/investigadores/investigadores.service";
import { LoginService } from "src/app/services/login/login.service";
import { LoginStatus } from "src/app/models/login/login-status";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SearchTarget } from 'src/app/models/search-target/search-target';

@Component({
  selector: "app-fenomenos",
  templateUrl: "./fenomenos.component.html",
  styleUrls: ["./fenomenos.component.css"],
})
export class FenomenosComponent implements OnInit {

  public fenomenos: Array<Fenomeno>;
  public idInvestigador: Number;
  public searchTarget: SearchTarget;
  public hasParams: Boolean;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService, private activatedRoute: ActivatedRoute) {

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
    this.searchTarget = <SearchTarget>{};
    this.hasParams = false;

  }

  ngOnInit() {

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

              this.idInvestigador = this.loginStatus.idInv;
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

      //Si no está a undefined, estaba navegando ya como usuario o público, así que cogemos la idInv de antes.
    } else {
      this.idInvestigador = this.loginStatus.idInv;
    }

    this.getFenomenos();

  }

  getFenomenos() {

    this.activatedRoute.queryParams.subscribe( data => {

      this.searchTarget = <SearchTarget>data;
      this.hasParams = true;
      console.log(this.searchTarget);

      this.fenomenosService.getFenomenos(this.searchTarget).subscribe(fenomenos => {
            
            setTimeout(() => this.fenomenos = fenomenos, 1000);
    
        },
        err => {
    
          console.log(err);
    
        }

      );

    });

  }

  deleteFenomeno(id: Number) {

    if (
      confirm(
        "El borrado del fenómeno seleccionado será irreversible.\n\n¿Desea proceder con la operación?"
      )
    ) {
      this.fenomenosService.deleteFenomeno(id).subscribe(
        (data) => {
          console.log(data);
          this.getFenomenos();
        },
        (err) => console.log(err)
      );
    }

  }
}

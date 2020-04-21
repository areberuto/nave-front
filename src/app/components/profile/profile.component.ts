import { Component, OnInit } from "@angular/core";
import { Investigador } from "src/app/models/investigador/investigador";
import { Fenomeno } from "src/app/models/fenomeno/fenomeno";
import { LoginStatus } from "src/app/models/login/login-status";
import { Observable, of } from "rxjs";
import { LoginService } from "src/app/services/login/login.service";
import { Router } from "@angular/router";
import { FenomenosService } from "src/app/services/fenomenos/fenomenos.service";
import { InvestigadoresService } from "src/app/services/investigadores/investigadores.service";
import * as CryptoJS from "crypto-js";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  public investigador: Investigador;
  public investigadorMod: Investigador;
  public fenomenos: Array<Fenomeno>;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  public mostrarAviso: Boolean;
  public claveDel: String;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fenomenosService: FenomenosService,
    private investigadoresService: InvestigadoresService
  ) {
    this.fenomenos = [];
    this.mostrarAviso = false;
    this.claveDel = "";
    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
  }

  ngOnInit(): void {
    //Suscripción para futuros cambios del loginStatus

    this.loginStatus$.subscribe((data) => {
      this.loginStatus = data;

      //Si estamos aquí dentro, es porque no venimos de navegación SPA. Pedimos datos
      //pues tras recibir la id:

      this.getDatosPerfil(this.loginStatus.idInv);
      this.getFenomenosByInvestigador(this.loginStatus.idInv);
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

      //Si ya había loginStatus (navegación), pedimos los datos
    } else {
      this.getDatosPerfil(this.loginStatus.idInv);
      this.getFenomenosByInvestigador(this.loginStatus.idInv);
    }

    //Si se intenta acceder a esta vista, manualmente, sin tener un idInv de usuario,
    //te devuelve al login

    if (this.loginStatus.idInv == -1) {
      this.router.navigate(["/"]);
    }
  }

  getDatosPerfil(idInv: Number) {
    this.investigadoresService.getInvestigadorById(idInv).subscribe(
      (data) => {
        console.log(data);
        this.investigador = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getFenomenosByInvestigador(idInv: Number) {
    this.fenomenosService.getFenomenosByInvestigador(idInv).subscribe(
      (fenomenos) => {
        console.log(fenomenos);
        this.fenomenos = fenomenos;
      },
      (err) => {
        console.log(err);
      }
    );
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
          this.getFenomenosByInvestigador(this.investigador.id);
        },
        (err) => console.log(err)
      );
    }
  }

  deleteInv() {

    const hashedClave = CryptoJS.SHA3(this.claveDel).toString();

    this.loginService.checkPassword(hashedClave).subscribe(
      (data) => {
        console.log(data);

        this.investigadoresService.deleteInv(this.investigador.id).subscribe(
          (data) => {

            alert('Tu cuenta y tus fenómenos han sido borrado con éxito.');
            this.router.navigate(['/']);

          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );

  }
}

import { Component, OnInit } from "@angular/core";
import { Fenomeno } from "src/app/models/fenomeno/fenomeno";
import { FenomenosService } from "src/app/services/fenomenos/fenomenos.service";
import { InvestigadoresService } from "src/app/services/investigadores/investigadores.service";
import { LoginService } from "src/app/services/login/login.service";
import { LoginStatus } from "src/app/models/login/login-status";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-fenomenos",
  templateUrl: "./fenomenos.component.html",
  styleUrls: ["./fenomenos.component.css"],
})
export class FenomenosComponent implements OnInit {

  public fenomenos: Array<Fenomeno>;
  public idInvestigador: Number;
  public seeInv: Number;
  public seeInvName: String;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService,private activatedRoute: ActivatedRoute) {

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();

    if (this.activatedRoute.snapshot.params["seeInv"]) {
      this.seeInv = this.activatedRoute.snapshot.params["seeInv"];
    }

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

    if (!this.seeInv) {
      this.getFenomenos();
    } else {
      this.getFenomenosUser(this.seeInv);
    }

  }

  getFenomenos() {

    this.fenomenosService.getFenomenos().subscribe(
      (fenomenos) => {
        console.log(fenomenos);
        this.fenomenos = fenomenos;
      },
      (err) => {
        console.log(err);
      }
    );

  }

  getFenomenosUser(seeInv: Number) {

    console.log("Getting fenomenos del usuario", seeInv);

    this.fenomenosService.getFenomenosByInvestigador(seeInv).subscribe(
      (data) => {
        console.log(data);
        console.log(data.length);
        //Si el usuario tuviera 0 fenómenos, buscamos su nombre. Sino, lo cogemos de aquí.

        if(data.length > 0){

          this.fenomenos = data;
          this.seeInvName = `${this.fenomenos[0].nombreInvestigador}` + ` ${this.fenomenos[0].apellidoInv1}`;

        } else {

          this.fenomenos = [];
          this.investigadoresService.getInvestigadorById(seeInv).subscribe(data =>{

            this.seeInvName = `${data.nombre}` + ` ${data.apellido1}`;

          }, err => {

            console.log(err);

          });
        }
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
          this.getFenomenos();
        },
        (err) => console.log(err)
      );
    }

  }
}

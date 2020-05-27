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
  public fenomenos: Array<Fenomeno>;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  public mostrarAviso: Boolean;
  public mostrarPwd: Boolean;
  public claveDel: String;
  public oldPwd: String;
  public newPwd: String;

  constructor(private loginService: LoginService, private router: Router, private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService) {

    this.mostrarAviso = false;
    this.mostrarPwd = false;
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

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe(

          (data) => {

            //Para guardar el nuevo token, que tendrá tiempos de
            //expedición y expiración diferentes.

            this.loginService.setSession(data);

            //Seteamos el login y actualizamos los suscriptores del loginStatus$

            this.loginService.setLoginStatus({ isAdmin: data["isAdmin"], idInv: data["idInv"] });

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

  getDatosPerfil(idInv: Number): void {

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

  getFenomenosByInvestigador(idInv: Number): void {

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

  actualizarDatos(): void {

    this.investigadoresService.updateInvestigador(this.investigador).subscribe(

      data => {

        if (data['rowCount'] > 0) {

          alert("Datos actualizados con éxito.");
          console.log(data);

          location.reload();

        }

        else {

          alert("Los datos no han podido actualizarse correctamente.");
          console.log(data);

        }

      },

      err => {

        alert("Los datos no han podido actualizarse correctamente.");
        console.log(err);

      }

    );

  }

  deleteFenomeno(id: Number): void {

    if (confirm("El borrado del fenómeno seleccionado será irreversible.\n\n¿Desea proceder con la operación?")) {

      this.fenomenosService.deleteFenomeno(id).subscribe(

        (data) => {

          console.log(data);
          this.getFenomenosByInvestigador(this.investigador.id);

        },
        (err) => console.log(err)

      );
    }
  }

  deleteInv(): void {

    const hashedClave = CryptoJS.SHA3(this.claveDel).toString();

    this.loginService.checkPassword(hashedClave).subscribe(

      (data) => {

        console.log(data);

        this.investigadoresService.deleteInv(this.investigador.id).subscribe(

          (data) => {
            
            if (data['rowCount'] > 0) {

              alert('Tu cuenta y tus fenómenos han sido borrado con éxito.');
            this.router.navigate(['/']);
    
            }
    
            else {
    
              alert("Error en el borrado. Vuelve a intentarlo o contacta con el administrador.");
              console.log(data);
    
            }

          },

          (err) => {

            alert("Error en el borrado. Vuelve a intentarlo o contacta con el administrador.");
            console.log(err);

          }
        );
      },

      (err) => {

        if(err.status == "401"){
        
          alert("Contraseña incorrecta.");
        
        }
        
        console.log(err);

      }

    );

  }

  verPassword(event): void {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "text");

  }

  ocultarPassword(event): void {

    event.preventDefault();
    const siblingInput: HTMLElement = event.target.previousSibling;
    siblingInput.setAttribute("type", "password");

  }

  //Muestra instrucciones para modificar contraseña

  mostrarModPwd(event): void {

    event.preventDefault();
    this.mostrarPwd = !this.mostrarPwd;

  }

  //Muestra instrucciones para borrar usuario

  mostrarWarning(event): void {

    event.preventDefault();
    this.mostrarAviso = !this.mostrarAviso;

  }

  modPwd(): void {

    const hashedOld = CryptoJS.SHA3(this.oldPwd).toString();
    const hashedNew = CryptoJS.SHA3(this.newPwd).toString();

    this.investigadoresService.modifyPassword(this.investigador.id, hashedOld, hashedNew).subscribe(

      data => {

        console.log(data);

        //Si se ha modificado la clave, procedemos a guardar el hash en memoria
        //y recargar para pedir nuevo token

        if (data["rowCount"]) {

          sessionStorage.setItem("hashedPass", data["hashedPass"]);
          location.reload();

        }

        else {

          alert("Algo ha ido mal.");
          
        }

      },

      err => {

        console.log(err);

      }
    )

  }

}

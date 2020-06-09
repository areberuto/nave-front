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
  public correoExiste: Boolean;
  public claveControl: String;
  public fenomenos: Array<Fenomeno>;
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  public mostrarAviso: Boolean;
  public mostrarPwd: Boolean;
  public claveDel: String;
  public oldPwd: String;
  public newPwd: String;

  constructor(private loginService: LoginService, private router: Router, private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService) {

    this.correoExiste = false;
    this.claveControl = "";
    this.mostrarAviso = false;
    this.mostrarPwd = false;
    this.claveDel = "";
    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();

  }

  ngOnInit(): void {

    this.loginStatus$.subscribe((data) => {

      this.loginStatus = data;

    });

    if (!this.loginStatus.idInv) {

      if (sessionStorage.getItem("idToken")) {

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe(

          (data) => {

            this.loginService.setSession(data);

            this.loginService.setLoginStatus({ isAdmin: data["isAdmin"], idInv: data["idInv"] });
            this.getDatosPerfil(this.loginStatus.idInv);

          },

          (err) => {

            console.log(err);
            this.loginService.setLoginStatus({ isAdmin: false, idInv: -1 });

          }

        );
      }

      else {

        this.loginService.setLoginStatus({ isAdmin: false, idInv: -1 });

      }

    } else {

      this.getDatosPerfil(this.loginStatus.idInv);

    }

    if (this.loginStatus.idInv == -1) {

      this.router.navigate(["/"]);

    }

  }

  getDatosPerfil(idInv: Number): void {

    this.investigadoresService.getInvestigadorById(idInv).subscribe(

      (data) => {

        setTimeout(() => {
                    
          this.investigador = data;
          this.getFenomenosByInvestigador(this.loginStatus.idInv);
           
        }, 1000);

      }, err => {

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

    });

  }

  actualizarDatos(): void {

    this.investigadoresService.updateInvestigador(this.investigador).subscribe(

      data => {

        if (data['affectedRows'] > 0) {

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

        }, (err) => console.log(err)
        
      );
    
    }
  
  }

  deleteInv(): void {

    console.log(this.claveDel);

    const hashedClave: String = CryptoJS.SHA3(this.claveDel).toString();

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

        if (err.status == "401") {

          alert("Contraseña incorrecta.");

        }

        console.log(err);

      }

    );

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

  mostrarModPwd(event: any): void {

    event.preventDefault();
    this.mostrarPwd = !this.mostrarPwd;

  }

  mostrarWarning(event: any): void {

    event.preventDefault();
    this.mostrarAviso = !this.mostrarAviso;

  }

  modPwd(): void {

    const hashedOld: String = CryptoJS.SHA3(this.oldPwd).toString();
    const hashedNew: String = CryptoJS.SHA3(this.newPwd).toString();

    this.investigadoresService.modifyPassword(this.investigador.id, hashedOld, hashedNew).subscribe(

      data => {

        console.log(data);

        if (data["hashedPass"]) {

          alert("Contraseña actualizada correctamente: inicia sesión de nuevo, por favor.");
          this.router.navigate(['/']);

        }

        else {

          alert("Algo ha ido mal.");

        }

      },

      err => {

        console.log(err);

      });

  }

  comprobarDisponibilidad(): void {

    this.investigadoresService.getInvestigadorByEmail(this.investigador.correo).subscribe(investigador => {

      if (!Object.keys(investigador).length) {

        setTimeout(() => this.correoExiste = false, 500);

      } else {

        if(investigador.id != this.investigador.id){

          setTimeout(() => this.correoExiste = true, 500);

        }

      }

    }, err => {

      console.log(err);

    });

  }

}

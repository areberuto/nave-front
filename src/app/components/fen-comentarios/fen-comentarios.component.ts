import { Component, OnInit } from '@angular/core';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { LoginStatus } from 'src/app/models/login/login-status';
import { Observable } from 'rxjs';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Comentario } from 'src/app/models/comentario/comentario';
import { Investigador } from 'src/app/models/investigador/investigador';

@Component({
  selector: 'app-fen-comentarios',
  templateUrl: './fen-comentarios.component.html',
  styleUrls: ['./fen-comentarios.component.css']
})
export class FenComentariosComponent implements OnInit {

  public idParam: Number;
  public fenomeno: Fenomeno;
  public idInvestigador: Number;
  public investigador: Investigador;
  public comentarios: Comentario[];
  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;
  public fenomenoNotFound: Boolean;
  public comentario: Comentario;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService, private route: Router, private activatedRoute: ActivatedRoute) {

    this.idParam = this.activatedRoute.snapshot.params['idFen'];
    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
    this.fenomenoNotFound = false;
    this.comentario = <Comentario>{};

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

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe((data) => {

          //Para guardar el nuevo token, que tendrá tiempos de
          //expedición y expiración diferentes.

          this.loginService.setSession(data);

          //Seteamos el login y actualizamos los suscriptores del loginStatus$

          this.loginService.setLoginStatus({ isAdmin: data["isAdmin"], idInv: data["idInv"] });
          this.idInvestigador = this.loginStatus.idInv;

          if(this.idInvestigador != -1){

            this.cargarInvestigador(this.idInvestigador);
      
          }

        }, (err) => {

          //Si no es válida, devolvemos el error.
          console.log(err);

        });

      }

      //Si tampoco tenemos token, por defecto establecemos el estado a público
      //y lo seteamos en el servicio para que el nav lo reciba.
      else {

        this.loginService.setLoginStatus({ isAdmin: false, idInv: -1 });

      }

      //Si no está a undefined, estaba navegando ya como usuario o público, así que cogemos la idInv de antes.
    } else {

      this.idInvestigador = this.loginStatus.idInv;

      if(this.idInvestigador != -1){

        this.cargarInvestigador(this.idInvestigador);
  
      }

    }

    this.getFenomeno(this.idParam);

  }

  getFenomeno(idFen: Number): void {

    this.fenomenosService.getFenomenoById(idFen).subscribe(data => {

      console.log(data);
      setTimeout(() => {
        
        if(!data.length){

          this.fenomenoNotFound = true;

        } else {

          this.fenomeno = data[0];
          this.fenomenosService.getComentarios(idFen).subscribe(data => {

            this.comentarios = data;

          }, err => {

            console.log(err);

          })

        }
        

      }, 1000);

    }, err => {

      console.log(err);

    })

  }

  cargarInvestigador(idInv: Number){

    this.investigadoresService.getInvestigadorById(idInv).subscribe(data => {

      this.investigador = data;

    }, err => {

      console.log(err);

    });

  }

  postComentario(): void {

    this.comentario.investigadorId = this.investigador.id;
    this.comentario.fenomenoId = this.fenomeno.id;
    
    console.log("Comentario enviado:", this.comentario);

    this.fenomenosService.postComentario(this.comentario).subscribe(data => {

      this.comentario = <Comentario>{};
      this.getFenomeno(this.fenomeno.id);

    }, err => {

      console.log(err);

    });

  }

  deleteFenomeno(id: Number): void {

    if (confirm("El borrado del fenómeno seleccionado será irreversible.\n\n¿Desea proceder con la operación?")) {

      this.fenomenosService.deleteFenomeno(id).subscribe(
        (data) => {

          alert("Fenómeno borrado con éxito.");
          this.route.navigate(["fenomenos"]);

        }, (err) => {

          console.log(err)

      });

    }

  }

  deleteComentario(id: Number): void {

    if (confirm("El borrado del comentario seleccionado será irreversible.\n\n¿Desea proceder con la operación?")) {

      this.fenomenosService.deleteComentario(id, this.comentario.investigadorId).subscribe(
        (data) => {

          alert("Comentario borrado con éxito.");
          this.getFenomeno(this.fenomeno.id);

        }, (err) => {

          console.log(err)

      });

    }

  }


}

import { Component, OnInit } from "@angular/core";
import { Fenomeno } from "src/app/models/fenomeno/fenomeno";
import { FenomenosService } from "src/app/services/fenomenos/fenomenos.service";
import { InvestigadoresService } from "src/app/services/investigadores/investigadores.service";
import { LoginService } from "src/app/services/login/login.service";
import { LoginStatus } from "src/app/models/login/login-status";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchTarget } from 'src/app/models/search-target/search-target';
import { Categoria } from 'src/app/models/categoria/categoria';

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
  public categorias: Categoria[];
  public moderar: Boolean;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService, private route: Router, private activatedRoute: ActivatedRoute) {

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();
    this.searchTarget = <SearchTarget>{};
    this.hasParams = false;

    this.moderar = location.href.indexOf("moderar") != -1;

  }

  ngOnInit(): void {

    this.loginStatus$.subscribe((data) => {

      this.loginStatus = data;

    });

    if (!this.loginStatus.idInv) {

      if (sessionStorage.getItem("idToken")) {
        
        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe((data) => {

          this.loginService.setSession(data);

          this.loginService.setLoginStatus({ isAdmin: data["isAdmin"], idInv: data["idInv"] });
          this.idInvestigador = this.loginStatus.idInv;

          if(this.activatedRoute.snapshot.params['idModerador']){
            
            if(!this.loginStatus.isAdmin){

              this.route.navigate(['/']);

            }

            this.getFenomenosModerar();
      
          } else {
      
            this.getFenomenos();
      
          }

        }, (err) => {

          console.log(err);

        });

      }

      else {

        this.loginService.setLoginStatus({ isAdmin: false, idInv: -1 });

        if(this.activatedRoute.snapshot.params['idModerador']){

          this.route.navigate(['/']);

        }

        this.getFenomenos();

      }

    } else {

      this.idInvestigador = this.loginStatus.idInv;

      if(this.activatedRoute.snapshot.params['idModerador']){
      
        if(!this.loginStatus.isAdmin){

          this.route.navigate(['/']);

        }

        this.getFenomenosModerar();
  
      } else {
  
        this.getFenomenos();
  
      }

    }

  }

  getFenomenos(): void {

    this.activatedRoute.queryParams.subscribe(data => {

      this.fenomenos = undefined;
      this.searchTarget = <SearchTarget>data;
      this.hasParams = Object.keys(this.searchTarget).length != 0;

      this.fenomenosService.getFenomenos(this.searchTarget).subscribe(fenomenos => {
        console.log(fenomenos);
        setTimeout(() => this.fenomenos = fenomenos, 1000);
        window.scroll(0, 0);

      }, err => {

        console.log(err);

      });

    });

  }

  getFenomenosModerar(): void {

    this.fenomenosService.getFenomenosModerar().subscribe(fenomenos => {

      setTimeout(() => this.fenomenos = fenomenos, 1000);
      window.scroll(0, 0);

    }, err => {

      console.log(err);

    });

  }

  deleteFenomeno(id: Number): void {

    if (confirm("El borrado del fenómeno seleccionado será irreversible.\n\n¿Desea proceder con la operación?")) {
      
      this.fenomenosService.deleteFenomeno(id).subscribe(
        (data) => {

          this.route.navigate(['/fenomenos']);

        }, (err) => {
          
          console.log(err)

      });

    }

  }

  aprobar(event: Event, idFen: Number): void {

    event.preventDefault();

    if(confirm("Al aprobar el fenómeno, este podrá ser visto por el resto de usuarios y el público. ¿Quieres proceder?")){

      this.fenomenosService.aprobarFenomeno(idFen).subscribe(data => {

        alert("Fenómeno aprobado.");
        this.fenomenos = undefined;
        this.getFenomenosModerar();

      }, err => {

        console.log("Algo ha ido mal.");

      });

    }


  }

}

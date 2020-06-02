import { Component, OnInit } from '@angular/core';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginStatus } from 'src/app/models/login/login-status';
import { LoginService } from 'src/app/services/login/login.service';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/categoria/categoria';

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

  public categorias: Categoria[];

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

        if(data.length){

          this.fenomeno = data[0];

        }

      }, err => {

        console.log(err);

      });

    }

  }

  ngOnInit(): void {

    //Suscripción para futuros cambios del loginStatus

    this.loginStatus$.subscribe(data => {

      this.loginStatus = data;

    });

    if(!this.loginStatus.idInv){

      if(sessionStorage.getItem('idToken')){

        this.loginService.refreshAuth(sessionStorage.getItem("email"), sessionStorage.getItem("hashedPass")).subscribe( data => {
            
            this.loginService.setSession(data);
    
            this.loginService.setLoginStatus({isAdmin: data['isAdmin'], idInv: data['idInv']});
  
            this.investigadorId = this.loginStatus.idInv;
            
          },

          (err) => {
    
            console.log(err);
            this.loginService.setLoginStatus({isAdmin: false, idInv: -1}); 

          }

        );

      } 
      
      else {

        this.loginService.setLoginStatus({isAdmin: false, idInv: -1}); 

      }

    } else {

      this.investigadorId = this.loginStatus.idInv;

    }

    if(this.loginStatus.idInv == -1){

      this.router.navigate(['/']);

    }

    this.cargarCategorias();

  }

  addFenomeno(){

    console.log(this.fenomeno);
    
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
      alert("Fenómeno actualizado con éxito.");
      this.router.navigate(['/fenomenos']);

    }, (err) => {

      alert(err.error.msg);
      console.log(err.error.msg); 

    });

  }
  
  ejecutarAccion(){

    console.log("Fenómeno que sale:", this.fenomeno);

    if(!this.fenomenoId){

      this.addFenomeno();

    } else {

      this.modFenomeno();

    }

  }

  cargarCategorias(){

    this.fenomenosService.getCategorias().subscribe( data => {

      console.log(data);
      this.categorias = data;

    }, err => {

      console.log(err);

    });

  }
}

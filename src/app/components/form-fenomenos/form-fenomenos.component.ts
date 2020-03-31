import { Component, OnInit, Input } from '@angular/core';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-fenomenos',
  templateUrl: './form-fenomenos.component.html',
  styleUrls: ['./form-fenomenos.component.css']
})
export class FormFenomenosComponent implements OnInit {

  @Input()
  public accion: String = 'Añadir fenómeno';
  public fenomeno: Fenomeno;
  public investigadorId: Number;
  public fenomenoId: Number;
  
  constructor(private fenomenosService: FenomenosService, private router: Router, private activatedRoute: ActivatedRoute) { 

    this.fenomeno = <Fenomeno>{};
    this.investigadorId = this.activatedRoute.snapshot.params['id'];

    //En el caso de que estemos modificando, preparar la vista para ello

    if(this.activatedRoute.snapshot.params['idFen']){

      this.fenomenoId = this.activatedRoute.snapshot.params['idFen'];
      this.accion = 'Modificar fenómeno';
      this.fenomenosService.getFenomenoById(this.fenomenoId).subscribe(data => {

        this.fenomeno = data;
        console.log(this.fenomeno);

      }, err => {

        console.log(err);

      });

    }

  }

  ngOnInit(): void {

  }

  addFenomeno(){

    this.fenomeno.investigadorId = this.investigadorId;

    this.fenomenosService.postFenomeno(this.fenomeno).subscribe(data => {

      console.log(data);

      this.router.navigate([`/view/${this.investigadorId}/fenomenos`]);

    }, err => {

      console.log(err);

    });

  }

  modFenomeno(){

    this.fenomenosService.putFenomeno(this.fenomeno).subscribe(data => {

      console.log(data);
      
      this.router.navigate([`/view/${this.investigadorId}/fenomenos`]);

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

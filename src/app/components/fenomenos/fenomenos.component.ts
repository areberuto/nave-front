import { Component, OnInit } from '@angular/core';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fenomenos',
  templateUrl: './fenomenos.component.html',
  styleUrls: ['./fenomenos.component.css']
})
export class FenomenosComponent implements OnInit {

  public fenomenos: Array<Fenomeno>;
  public idInvestigador: Number;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private activatedRoute: ActivatedRoute) { 

    this.idInvestigador = -1;
    this.fenomenos = [];

  }

  ngOnInit() {
    
    if(this.activatedRoute.snapshot.params['id']){

      this.idInvestigador = this.activatedRoute.snapshot.params['id'];
      
    }

    this.getFenomenos();
    

  }

  getFenomenos(){

    this.fenomenosService.getFenomenos().subscribe(fenomenos => {

      console.log(fenomenos);

      this.fenomenos = fenomenos;

    });

  }

  getFenomenosUser(event: Number){

    console.log('Getting fenomenos del usuario');
    this.fenomenosService.getFenomenosById(event).subscribe(data => {

      console.log(data);
      this.fenomenos = data;

    }, err => {

      console.log(err);

    });

  }

  deleteFenomeno(id: Number){

    if(confirm('El borrado del fenómeno seleccionado será irreversible.\n\n¿Desea proceder con la operación?')){

      this.fenomenosService.deleteFenomeno(id).subscribe(data => {
        
        console.log(data)
        this.getFenomenos();
        
      }, err => console.log(err));

    } 

  }

  
}

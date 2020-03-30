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

  constructor(private fenomenosService: FenomenosService, private router: Router, private activatedRoute: ActivatedRoute) { 

    this.fenomeno = <Fenomeno>{};
    this.investigadorId = this.activatedRoute.snapshot.params['id'];

  }

  ngOnInit(): void {
  }

  addFenomeno(){

    this.fenomeno.investigadorId = this.investigadorId;
    console.log('POSTing este fenomeno:');
    console.log(this.fenomeno);
    
    this.fenomenosService.postFenomeno(this.fenomeno).subscribe(data => {

      console.log(data);
      this.router.navigate([`/view/${this.investigadorId}/fenomenos`]);

    }, err => {

      console.log(err);

    });

  }
}

import { Component, OnInit } from '@angular/core';
import { Investigador } from 'src/app/models/investigador/investigador';
import { LoginStatus } from 'src/app/models/login/login-status';
import { Observable } from 'rxjs';
import { FenomenosService } from 'src/app/services/fenomenos/fenomenos.service';
import { InvestigadoresService } from 'src/app/services/investigadores/investigadores.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-investigadores',
  templateUrl: './investigadores.component.html',
  styleUrls: ['./investigadores.component.css']
})
export class InvestigadoresComponent implements OnInit {

  public investigadores: Array<Investigador>;

  public loginStatus: LoginStatus;
  public loginStatus$: Observable<LoginStatus>;

  constructor(private fenomenosService: FenomenosService, private investigadoresService: InvestigadoresService, private loginService: LoginService) { 

    this.loginStatus = this.loginService.getLoginStatus();
    this.loginStatus$ = this.loginService.getLoginStatus$();

  }

  ngOnInit(): void {

    this.investigadoresService.getInvestigadores();
    
  }

}

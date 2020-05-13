import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login/login.service';

declare let L;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title: string = 'La nave del misterio';
  
  constructor(private loginService: LoginService){

  }

  ngOnInit(){

    
  }

}

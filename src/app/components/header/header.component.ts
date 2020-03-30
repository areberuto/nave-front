import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public title: string;
  public iconRoute: string;

  constructor() { 

    this.title = 'La nave del misterio';
    this.iconRoute = './favicon.ico';

  }

  ngOnInit(): void {
  }

}

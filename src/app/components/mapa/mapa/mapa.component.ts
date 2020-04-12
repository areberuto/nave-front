import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @Input() public latitud: Number;
  @Input() public longitud: Number;
  @Input() public idFen: Number;

  public mapa: mapboxgl.Map;

  constructor() {

    console.log('idFen en el constructor:', this.idFen);
    
  }

  ngOnInit(): void {

    console.log('idFen en el onInit:', this.idFen);
    
    (mapboxgl as any).accessToken = environment.mapboxToken;

    // setTimeout(() => {

    //   this.mapa = new mapboxgl.Map({
    //     container: id,
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     center: [-5.981415, 37.3836722],
    //     zoom: 15
    //   });

    // }, 0);

  }

  ngAfterViewInit(){

    const id = `mapa${this.idFen}`;

    this.mapa = new mapboxgl.Map({
      container: id,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-5.981415, 37.3836722],
      zoom: 15
    });

    new mapboxgl.Marker().setLngLat([-5.981415, 37.3836722]).addTo(this.mapa);

  }

}

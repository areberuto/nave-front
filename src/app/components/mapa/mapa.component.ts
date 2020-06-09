import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @Input() public latitud: number;
  @Input() public longitud: number;
  @Input() public idFen: Number;

  public mapa: mapboxgl.Map;

  constructor() {

    
  }

  ngOnInit(): void {
    
    (mapboxgl as any).accessToken = environment.mapboxToken;

  }

  ngAfterViewInit(): void{

    const id: string = `mapa${this.idFen}`;
    
    this.mapa = new mapboxgl.Map({
      container: id,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 15
    });

    new mapboxgl.Marker().setLngLat([this.longitud, this.latitud]).addTo(this.mapa);

  }

}

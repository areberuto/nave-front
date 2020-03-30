import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';

@Injectable({
  providedIn: 'root'
})

export class FenomenosService {

  private url: string = 'http://localhost:4001/fenomenos';

  constructor(private http: HttpClient) {  

  }

  getFenomenos(){

    return this.http.get<Fenomeno[]>(`${this.url}/`);

  }

  getFenomenosById(id: Number){

    return this.http.get<Fenomeno[]>(`${this.url}?id=${id}`);

  }

  postFenomeno(fenomeno: Fenomeno){

    console.log("El servicio de post ha recibido:");
    console.log(fenomeno);  
    return this.http.post(`${this.url}/`, {fenomeno: fenomeno});

  }

  deleteFenomeno(id: Number){

    return this.http.delete(`${this.url}?id=${id}`);

  }

}

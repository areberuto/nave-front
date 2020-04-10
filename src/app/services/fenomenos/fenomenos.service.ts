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

  getFenomenosByInvestigador(idInv: Number){

    return this.http.get<Fenomeno[]>(`${this.url}?idInv=${idInv}`);

  }

  getFenomenoById(id: Number){

    return this.http.get<Fenomeno>(`${this.url}?idFen=${id}`);

  }

  postFenomeno(fenomeno: Fenomeno){

    console.log("Fenómeno recibido para insertar:");
    console.log(fenomeno);  
    return this.http.post(`${this.url}/`, {fenomeno: fenomeno});

  }

  putFenomeno(fenomeno: Fenomeno){

    console.log("Actualizando fenómeno.");
    return this.http.put(`${this.url}/`, {fenomeno: fenomeno});

  }

  deleteFenomeno(id: Number){

    return this.http.delete(`${this.url}?id=${id}`);

  }

}

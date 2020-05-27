import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { SearchTarget } from 'src/app/models/search-target/search-target';

@Injectable({
  providedIn: 'root'
})

export class FenomenosService {

  private url: string = 'http://localhost:4001/fenomenos';

  constructor(private http: HttpClient) {  


    
  }

  getFenomenos(searchTarget: SearchTarget){

    const params: HttpParams = JSON.parse(JSON.stringify(searchTarget));

    console.log(params);

    return this.http.get<Fenomeno[]>(`${this.url}/`, {params: params});

  }

  getFenomenosByInvestigador(idInv: Number){

    return this.http.get<Fenomeno[]>(`${this.url}?idInv=${idInv}`);

  }

  getFenomenoById(id: Number){

    return this.http.get<Fenomeno>(`${this.url}?idFen=${id}`);

  }

  postFenomeno(fenomeno: Fenomeno){
 
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

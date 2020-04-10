import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Investigador } from 'src/app/models/investigador/investigador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvestigadoresService {

  private url: string = 'http://localhost:4001/investigadores';

  constructor(private http: HttpClient) {  

  }

  getInvestigadores(){

    return this.http.get<Investigador[]>(`${this.url}/`);

  }

  getInvestigadorById(id: Number){

    return this.http.get<Investigador>(`${this.url}?id=${id}`);

  }

  getInvestigadorByEmail(email: string){

    return this.http.get<Investigador>(`${this.url}?email=${email}`);
  
  }

}

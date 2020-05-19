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

  getInvestigadorByEmail(email: String){

    return this.http.get<Investigador>(`${this.url}?email=${email}`);
  
  }

  updateInvestigador(investigador: Investigador){

    let idInv: Number = investigador.id;

    return this.http.put(`${this.url}/updateInv?idInv=${idInv}`, {investigador: investigador});

  }

  modifyPassword(idInv: Number, oldPwd: String, newPwd: String){

    return this.http.put(`${this.url}/updatePwd?idInv=${idInv}`, {oldPwd: oldPwd, newPwd: newPwd});

  }

  deleteInv(idInv: Number){

    return this.http.delete(`${this.url}/delete?idInv=${idInv}`)

  }

}

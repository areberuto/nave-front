import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Investigador } from 'src/app/models/investigador/investigador';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvestigadoresService {

  private url: string = `${environment.apiUrl}/investigadores`;

  constructor(private http: HttpClient) {  

  }

  getInvestigadores(): Observable<Investigador[]>{

    return this.http.get<Investigador[]>(`${this.url}/`);

  }

  getInvestigadorById(id: Number): Observable<Investigador>{

    return this.http.get<Investigador>(`${this.url}?id=${id}`);

  }

  getInvestigadorByEmail(email: String): Observable<Investigador>{

    return this.http.get<Investigador>(`${this.url}?email=${email}`);
  
  }

  updateInvestigador(investigador: Investigador): Observable<Object>{

    let idInv: Number = investigador.id;

    return this.http.put(`${this.url}/updateInv?idInv=${idInv}`, {investigador: investigador});

  }

  modifyPassword(idInv: Number, oldPwd: String, newPwd: String): Observable<Object>{

    return this.http.put(`${this.url}/updatePwd?idInv=${idInv}`, {oldPwd: oldPwd, newPwd: newPwd});

  }

  deleteInv(idInv: Number): Observable<Object>{

    return this.http.delete(`${this.url}/delete?idInv=${idInv}`)

  }

}

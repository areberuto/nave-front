import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Fenomeno } from 'src/app/models/fenomeno/fenomeno';
import { SearchTarget } from 'src/app/models/search-target/search-target';
import { Categoria } from 'src/app/models/categoria/categoria';
import { Observable } from 'rxjs';
import { Comentario } from 'src/app/models/comentario/comentario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FenomenosService {

  private url: string = `${environment.apiUrl}/fenomenos`;

  constructor(private http: HttpClient) {


  }

  getFenomenos(searchTarget: SearchTarget): Observable<Fenomeno[]> {

    const params: HttpParams = JSON.parse(JSON.stringify(searchTarget));

    return this.http.get<Fenomeno[]>(`${this.url}/`, { params: params });

  }

  getFenomenosByInvestigador(idInv: Number): Observable<Fenomeno[]> {

    return this.http.get<Fenomeno[]>(`${this.url}?idInv=${idInv}`);

  }

  getFenomenoById(idFen: Number): Observable<Fenomeno[]> {

    return this.http.get<Fenomeno[]>(`${this.url}?idFen=${idFen}`);

  }

  getFenomenosModerar(): Observable<Fenomeno[]> {

    return this.http.get<Fenomeno[]>(`${this.url}/moderar`);

  }
  
  getComentarios(idFen: Number): Observable<Comentario[]> {

    return this.http.get<Comentario[]>(`${this.url}/comentarios?idFen=${idFen}`);
    
  }

  getCategorias(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(`${this.url}/categorias`);

  }

  postFenomeno(fenomeno: Fenomeno): Observable<Object> {

    return this.http.post(`${this.url}/`, { fenomeno });

  }

  postComentario(comentario: Comentario): Observable<Object> {

    return this.http.post(`${this.url}/comentarios`, { comentario });

  }

  aprobarFenomeno(idFen: Number): Observable<Object> {

    return this.http.put(`${this.url}/aprobar`, { idFen });
  }

  putFenomeno(fenomeno: Fenomeno): Observable<Object> {

    return this.http.put(`${this.url}/`, { fenomeno });

  }

  deleteFenomeno(id: Number): Observable<Object> {

    return this.http.delete(`${this.url}?id=${id}`);

  }

  deleteComentario(idCom: Number, comIdInv: Number): Observable<Object>{

    return this.http.delete(`${this.url}/comentarios?id=${idCom}&comIdInv=${comIdInv}`);

  }

}

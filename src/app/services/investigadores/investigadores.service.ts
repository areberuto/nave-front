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

  checkLogin(email: string, clave: string){

    //checkLogin devuelve un Observable
    //al cual un consumidor se puede suscribir.

    return new Observable<Object>(observer => {

      //El observable nº 1 se suscribe a otro observable nº 2, y cuando el segundo devuelva los datos de la peticion asíncrona...

      //... Mirará si la clave del investigador devuelto es igual a la clave introducida, y emitirá esta comparación para los consumidores junto al ID del investigador.

      this.getInvestigadorByEmail(email).subscribe(investigador => {

        console.log('Chequeando clave');
        observer.next({id: investigador.id, login: investigador.clave == clave});
        observer.complete();
        

      }, err => {

        observer.error(err);
        observer.complete();

      });

      

    });

  }

}

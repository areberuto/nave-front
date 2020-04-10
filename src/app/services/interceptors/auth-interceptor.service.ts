import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//La interfaz HttpInterceptor sirve para
//"pillar" las peticiones/respuestas y manejarlas,
//desde crear una respuesta artificial hasta modificarla,
//igual que en Express. ¡Es middleware!

export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

      const idToken = sessionStorage.getItem("idToken");

      //Si el token está presente, clonamos la
      //petición y le añadimos el token en la cabecera.

      if (idToken) {

          const cloned = req.clone({
              headers: req.headers.set("Authorization",
                  `Bearer ${idToken}`)
          });

          //Pasamos la petición al siguiente handler
          //que en este caso es el HttpClient final.

          return next.handle(cloned);
      }

      //Si no hay token, pasamos la petición
      //tal cual

      else {

          return next.handle(req);

      }

  }
  
}

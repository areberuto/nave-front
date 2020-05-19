import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Investigador } from "src/app/models/investigador/investigador";
import { Router } from "@angular/router";
import { LoginStatus } from "src/app/models/login/login-status";
import { Subject, Observable, Observer } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private url: string = "http://localhost:4001/login";

  private loginStatus: LoginStatus;

  private loginStatus$ = new Subject<LoginStatus>();

  public lgStchecker: Observable<Object>;

  constructor(private http: HttpClient, private router: Router) {
    //Estado por defecto

    this.loginStatus = {
      isAdmin: false,
      idInv: undefined,
    };

  }

  getLoginStatus() {
    return this.loginStatus;
  }

  setLoginStatus(lgSt: LoginStatus) {
    this.loginStatus = lgSt;
    this.loginStatus$.next(this.loginStatus);
  }

  getLoginStatus$(): Observable<LoginStatus> {
    return this.loginStatus$.asObservable();
  }

  refreshAuth(email: String, hashedPass: String) {
    return this.http.post(`${this.url}/refreshAuth`, {
      email: email,
      hashedPass: hashedPass,
    });
  }

  checkLogin(email: String, clave: String) {
    return this.http.post(`${this.url}/checkLogin`, {
      email: email,
      clave: clave,
    });
  }

  setSession(data: object) {
    console.log("Setteando nuevos datos de session");

    sessionStorage.setItem("idToken", data["idToken"]);
    sessionStorage.setItem("email", data["email"]);
    sessionStorage.setItem("hashedPass", data["hashedPass"]);
  }

  logOut() {

    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("hashedPass");

    if (this.router.url != "/") {
      this.router.navigate(["/"]);
    }
  }

  registerInvestigador(investigador: Investigador) {
    
    return this.http.post(`${this.url}/register`, {investigador: investigador});

  }

  checkPassword(claveInput: String){

    return this.http.post(`${this.url}/checkPassword`, {clave: claveInput});
    
  }

}

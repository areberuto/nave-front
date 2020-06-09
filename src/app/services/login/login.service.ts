import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Investigador } from "src/app/models/investigador/investigador";
import { Router } from "@angular/router";
import { LoginStatus } from "src/app/models/login/login-status";
import { Subject, Observable } from "rxjs";

@Injectable({

  providedIn: "root"

})
export class LoginService {

  private url: string = "http://localhost:4001/login";

  private loginStatus: LoginStatus;

  private loginStatus$ = new Subject<LoginStatus>();

  public lgStchecker: Observable<Object>;

  constructor(private http: HttpClient, private router: Router) {
    
    this.loginStatus = {

      isAdmin: false,
      idInv: undefined

    };

  }

  getLoginStatus(): LoginStatus {
    return this.loginStatus;
  }

  setLoginStatus(lgSt: LoginStatus): void {

    this.loginStatus = lgSt;
    this.loginStatus$.next(this.loginStatus);

  }

  getLoginStatus$(): Observable<LoginStatus> {

    return this.loginStatus$.asObservable();

  }

  refreshAuth(email: String, hashedPass: String): Observable<Object> {

    return this.http.post(`${this.url}/refreshAuth`, {

      email: email,
      hashedPass: hashedPass

    });

  }

  checkLogin(email: String, clave: String): Observable<Object> {

    return this.http.post(`${this.url}/checkLogin`, { email: email, clave: clave });

  }

  setSession(data: object): void {

    sessionStorage.setItem("idToken", data["idToken"]);
    sessionStorage.setItem("email", data["email"]);
    sessionStorage.setItem("hashedPass", data["hashedPass"]);

  }

  logOut(): void {

    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("hashedPass");

    if (this.router.url != "/") {

      this.router.navigate(["/"]);

    }

  }

  uploadAvatar(img: HTMLImageElement): Observable<Object>{

    return this.http.post(`${this.url}/uploadAvatar`, {img});

  }

  registerInvestigador(investigador: Investigador): Observable<Object> {

    return this.http.post(`${this.url}/register`, { investigador: investigador });

  }

  checkPassword(claveInput: String): Observable<Object> {

    return this.http.post(`${this.url}/checkPassword`, { clave: claveInput });

  }

  verify(codGen: String): Observable<Object> {

    return this.http.post(`${this.url}/verify`, { codGen });

  }

  pwOlvidada(email: String): Observable<Object> {

    return this.http.post(`${this.url}/pwOlvidada`, { email });

  }

  resetPwd(tmpClave: String, tmpClaveSHA: String): Observable<Object> {

    return this.http.post(`${this.url}/resetPwd`, { tmpClave, tmpClaveSHA });

  }

}

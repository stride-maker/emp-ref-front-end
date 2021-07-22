import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

import CryptoJS from "crypto-js";
import { Injectable } from "@angular/core";
import { UserToken } from "../model/user-token.model";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseLoginUrl = environment.baseLoginUrl;
  socialEmail = environment.socialLoginEmail;
  socialPassword = environment.socialLoginPassword;
  tokenSecretKey = environment.token_secret_key;

  private currentUserSubject: BehaviorSubject<String>;
  public currentUser: Observable<String>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<String>(
      localStorage.getItem("api-key")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  login(userEmail: string, userPassword: string) {
    const headers = {
      Authorization:
        "Basic " +
        btoa(
          "b8c1b32c2150a3cc7c9a21fbaabfcdf9c5d0bb32766509e957c134e07817852e:7ac9d31e8e2f6316f9cc7e24118ca5822d1d3393b99a9b15ba068e9b6c798746"
        ),
      "Content-type": "application/x-www-form-urlencoded",
    };
    const loginParams = new HttpParams()
      .set("grant_type", "password")
      .set("username", userEmail)
      .set("password", userPassword);
    return this.http
      .post(this.baseLoginUrl, loginParams.toString(), {
        headers,
      })
      .pipe(
        map((userToken: UserToken) => {
          let apiKey = CryptoJS.AES.encrypt(
            userToken["access_token"],
            this.tokenSecretKey
          ).toString();
          localStorage.setItem("api-key", apiKey);
          this.currentUserSubject.next(userToken["access_token"]);
          return userToken;
        })
      );
  }

  socialLogin() {
    const headers = {
      Authorization:
        "Basic " +
        btoa(
          "008954264e3abfee66e7d9e003fd4aabdfb8179616e2297a56e9ed0d8cd27725:5d6e89a3c6ac721f22af601079cf2e537bc56d0a03c870b1571f6f4db05762e8"
        ),
      "Content-type": "application/x-www-form-urlencoded",
    };
    const socialloginParams = new HttpParams()
      .set("grant_type", "password")
      .set("username", this.socialEmail)
      .set("password", this.socialPassword);
    return this.http
      .post(this.baseLoginUrl, socialloginParams.toString(), {
        headers,
      })
      .pipe(
        map((userToken: UserToken) => {
          let apiKey = CryptoJS.AES.encrypt(
            userToken["access_token"],
            this.tokenSecretKey
          ).toString();
          localStorage.setItem("api-key", apiKey);
          this.currentUserSubject.next(userToken["access_token"]);
          return userToken;
        })
      );
  }

  logout() {
    localStorage.removeItem("api-key");
    localStorage.removeItem("login-id-user");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    this.currentUserSubject.next(null);
  }
}

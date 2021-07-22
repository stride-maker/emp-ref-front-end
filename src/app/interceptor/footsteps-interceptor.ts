import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import CryptoJS from "crypto-js";
import { Injectable } from "@angular/core";
import { LoginService } from "../services/login.service";
import { environment } from "src/environments/environment";

@Injectable()
export class FootstepsInterceptor implements HttpInterceptor {
  tokenSecretKey = environment.token_secret_key;
  baseUrl = environment.baseUrl;
  constructor(private loginService: LoginService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.loginService.currentUserValue;
    if (currentUser) {
      const jwtToken = CryptoJS.AES.decrypt(
        localStorage.getItem("api-key"),
        this.tokenSecretKey
      ).toString(CryptoJS.enc.Utf8);

      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + jwtToken,
        },
      });
      if (
        !(
          request.url == this.baseUrl + "/user/resume/upload" ||
          request.url == this.baseUrl + "/user/image/upload"
        )
      ) {
        request = request.clone({
          setHeaders: {
            "Content-type": "application/json",
          },
        });
      }
    }
    return next.handle(request);
  }
}

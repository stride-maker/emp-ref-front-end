import {
  ErrorHandler,
  Injectable,
  Injector,
  NgZone,
  OnInit,
} from "@angular/core";

import { HttpErrorResponse } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";

@Injectable()
export class FootstepsErrorHandler implements ErrorHandler {
  private router: Router;

  constructor(
    private injector: Injector,
    private loginService: LoginService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    setTimeout(() => {
      this.router = injector.get(Router);
    });
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error.error == "invalid_token") {
      this.loginService.logout();
      error.error.error_description = "Session Expired";
      this.ngZone.run(() => {
        this.router.navigate(["expired-logout"]);
      });
    } else if (error.error.error == "invalid_grant" || error.status == 401) {
      error.error.error_description = "Invalid username or password!";
      this.ngZone.run(() => {
        this.notificationService.error(error.error.error_description);
      });
    } else if (
      error.error.error == "user_already_exist" ||
      error.error.error == "user_does_not_exist" ||
      error.error.error == "confirmation_code_incorrect" ||
      error.error.error == "email_already_exist"
    ) {
      this.ngZone.run(() => {
        this.notificationService.warn(error.error.error_description);
      });
    } else if (
      error.error.error == "generic_error" ||
      error.status == 500 ||
      error.error.error_description == undefined
    ) {
      const currentUser = this.loginService.currentUserValue;
      if (currentUser) {
        this.ngZone.run(() => {
          this.router.navigate(["home"]);
          this.notificationService.info(
            "Oops! Something went really wrong." +
              " Logout and please login again..... "
          );
        });
      } else {
        error.error.error_description =
          "Oops! Please contact administrator! Something went really wrong...";
        this.ngZone.run(() => {
          this.notificationService.error(error.error.error_description);
        });
      }
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ChangeEmail } from "../model/change-email.model";
import { ChangePassword } from "../model/change-password.model";
import { Header } from "../model/header.model";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-inside-header",
  templateUrl: "./inside-header.component.html",
  styleUrls: ["./inside-header.component.css"],
})
export class InsideHeaderComponent implements OnInit {
  currentUser: string;

  showEmailCheckModal = false;
  showPasswordCheckModal = false;

  selectedFile: File;
  headerImageUrl: string;

  time = new Date();
  headerNames = new Header();
  changeEmailRequest = new ChangeEmail();
  changePasswordRequest = new ChangePassword();
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.headerNames.firstName = localStorage.getItem("firstName");
    this.headerNames.lastName = localStorage.getItem("lastName");
  }

  changeEmail(changeEmailModelForm: any) {
    if (
      changeEmailModelForm.value.setEmail1 !=
      changeEmailModelForm.value.setEmail2
    ) {
      changeEmailModelForm.reset();
      this.notificationService.error("Email did not match");
    } else {
      this.changeEmailRequest.oldEmail = this.currentUser;
      this.changeEmailRequest.newEmail = changeEmailModelForm.value.setEmail2;

      this.userService
        .changeEmail(this.changeEmailRequest)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            changeEmailModelForm.reset();
          })
        )
        .subscribe((response) => {
          this.loginService.logout();
          this.showEmailCheckModal = true;
          document.getElementById("openEmailModalButton").click();
        });
    }
  }

  changePassword(changePasswordModelForm: any) {
    if (
      changePasswordModelForm.value.setPassword1 !=
      changePasswordModelForm.value.setPassword2
    ) {
      changePasswordModelForm.reset();
      this.notificationService.error("Password did not match");
    } else {
      this.changePasswordRequest.email = this.currentUser;
      this.changePasswordRequest.changePassword =
        changePasswordModelForm.value.setPassword2;

      this.userService
        .changePassword(this.changePasswordRequest)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            changePasswordModelForm.reset();
          })
        )
        .subscribe((response) => {
          this.loginService.logout();
          this.showPasswordCheckModal = true;
          document.getElementById("openPasswordModalButton").click();
        });
    }
  }

  resetChangeEmailForm(changeEmailModelForm: any) {
    changeEmailModelForm.reset();
  }

  resetChangePasswordForm(changePasswordModelForm: any) {
    changePasswordModelForm.reset();
  }

  loginAgain() {
    this.router.navigate(["login"]);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(["logout"]);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

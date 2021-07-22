import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../services/notification.service";
import { ResetPasswordRequest } from "../model/reset-password-request.model";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false;

  resetToken: string;

  resetPasswordRequest = new ResetPasswordRequest();
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetToken = localStorage.getItem("resetPassToken");
    localStorage.removeItem("resetPassToken");
  }

  resetPassword(resetPasswordForm: any) {
    if (
      resetPasswordForm.value.resetPassword2 !=
      resetPasswordForm.value.resetPassword1
    )
      this.notificationService.error("Password did not match");
    else {
      this.isLoading = true;
      this.resetPasswordRequest.resetToken = this.resetToken;
      this.resetPasswordRequest.resetPassword =
        resetPasswordForm.value.resetPassword2;

      this.userService
        .resetPassword(this.resetPasswordRequest)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response) => {
          this.isLoading = false;
          this.router.navigate(["/login"]);
        });
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

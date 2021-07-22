import { ActivatedRoute, Router } from "@angular/router";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from "angular-6-social-login";
import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ForgotPasswordRequest } from "../model/forgot-password-request.model";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { NotificationService } from "../services/notification.service";
import { UserRequest } from "../model/user-request.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  isSending = false;

  encryptSalt: any;
  returnUrl: string = "";
  userEmail: string;
  userPassword: string;
  showModalBox: boolean;

  authenticatedSocialUser = new SocialUser();
  userRequest = new UserRequest();
  forgotPasswordRequest = new ForgotPasswordRequest();
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private OAuth: AuthService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.activatedRoute.snapshot.queryParams["returnUrl"])
        this.returnUrl = params["returnUrl"];
    });
  }

  ngOnInit() {
    const currentUser = this.loginService.currentUserValue;
    if (currentUser) this.router.navigate(["/dashboard"]);
  }

  applogin(loginForm: any) {
    this.isLoading = true;
    this.userEmail = loginForm.value.loginEmail;
    this.userPassword = loginForm.value.loginPassword;
    this.loginService
      .login(this.userEmail, this.userPassword)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        localStorage.setItem("login-id-user", this.userEmail);
        this.isLoading = false;
        this.returnUrl == ""
          ? this.router.navigate(["/dashboard"])
          : this.router.navigateByUrl(this.returnUrl);
      });
  }

  forgotPassword(forgotPasswordForm: any) {
    this.isSending = true;
    this.forgotPasswordRequest.email = forgotPasswordForm.value.inputEmail;
    this.userService
      .forgotPassword(this.forgotPasswordRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSending = false;
          forgotPasswordForm.reset();
        })
      )
      .subscribe((response) => {
        this.isSending = false;
        this.notificationService.info(
          "Reset password link is sent to your mail id!"
        );
      });
  }

  socialLogin(socialProvider: string) {
    let platformProvider: any;
    if (socialProvider === "facebook") {
      platformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === "google") {
      platformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(platformProvider).then((socialUser) => {
      this.authenticatedSocialUser = socialUser;
      if (!this.authenticatedSocialUser.email) {
        this.notificationService.error(
          "Email is not configured within Facebook. Please add email and try again..."
        );
        return;
      }
      this.checkUserInApplication(this.authenticatedSocialUser.email);
    });
  }

  checkUserInApplication(email: string) {
    this.isSending = true;
    this.userService
      .findUser(email)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSending = false;
        })
      )
      .subscribe((response) => {
        if (response.toString() == "false") {
          this.isSending = false;
          document.getElementById("openModalButton").click();
        } else {
          this.signIntoApplication();
        }
      });
  }

  createUserAndLogin(socialLoginForm: any) {
    if (
      socialLoginForm.value.setPassword2 != socialLoginForm.value.setPassword1
    ) {
      socialLoginForm.reset();
      this.notificationService.error("Password did not match");
    } else {
      this.isSending = true;
      this.userRequest.setEmail = this.authenticatedSocialUser.email;
      this.userRequest.setPassword = socialLoginForm.value.setPassword2;

      let splittedName = this.authenticatedSocialUser.name.split(" ");
      this.userRequest.setFirstName = splittedName[0];
      this.userRequest.setLastName = splittedName[1];

      this.userService
        .createUser(this.userRequest)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.isSending = false;
            socialLoginForm.reset();
          })
        )
        .subscribe((response) => {
          this.signIntoApplication();
        });
    }
  }

  signIntoApplication() {
    this.loginService
      .socialLogin()
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSending = false;
        })
      )
      .subscribe((response) => {
        localStorage.setItem(
          "login-id-user",
          this.authenticatedSocialUser.email
        );
        this.isSending = false;
        this.returnUrl == ""
          ? this.router.navigate(["/dashboard"])
          : this.router.navigateByUrl(this.returnUrl);
      });
  }

  openModalBox(value: boolean) {
    this.showModalBox = value;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

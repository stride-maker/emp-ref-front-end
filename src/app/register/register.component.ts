import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../services/notification.service";
import { UserRequest } from "../model/user-request.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  showRegisterSuccessfulModal = false;

  userRequest = new UserRequest();
  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  register(registerForm: any) {
    this.isLoading = true;
    this.userRequest.setFirstName = registerForm.value.firstName;
    this.userRequest.setLastName = registerForm.value.lastName;
    this.userRequest.setEmail = registerForm.value.email;
    this.userRequest.setPassword = registerForm.value.password;

    this.userService
      .createUser(this.userRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.showRegisterSuccessfulModal = true;
        document.getElementById("registerSuccessfulButton").click();
      });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

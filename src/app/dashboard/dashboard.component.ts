import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { Dashboard } from "../model/dashboard.model";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserBasicDetails } from "../model/user-basic-details.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  currentUser: string;

  showLoadingScreen = true;
  showWaiting = false;
  showLocation = false;
  showPhoneNumber = false;
  hideEmailModal = false;
  showEmailModal = false;

  emailCountdownTimer: number;
  emailInterval: any;
  currentDate: Date;

  dashboard = new Dashboard();
  userBasicDetails = new UserBasicDetails();
  referredJobTime = "0";
  respondedJobTime = "0";
  seekedJobTime = "0";
  constructor(private userService: UserService, private router: Router) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.userService
      .getDashboard(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((response: Dashboard) => {
        this.dashboard = response;
        localStorage.setItem("firstName", this.dashboard.firstName);
        localStorage.setItem("lastName", this.dashboard.lastName);
        if (this.dashboard.lastReferredDate != null) {
          this.referredJobTime = this.getTimeValue(
            this.currentDate,
            new Date(this.dashboard.lastReferredDate)
          );
        } else {
          this.referredJobTime = "0 days";
        }
        if (this.dashboard.lastResponseDate != null) {
          this.respondedJobTime = this.getTimeValue(
            this.currentDate,
            new Date(this.dashboard.lastResponseDate)
          );
        } else {
          this.respondedJobTime = "0 days";
        }
        if (this.dashboard.lastAppliedDate != null) {
          this.seekedJobTime = this.getTimeValue(
            this.currentDate,
            new Date(this.dashboard.lastAppliedDate)
          );
        } else {
          this.seekedJobTime = "0 days";
        }
      });
  }

  showVerifyEmail() {
    this.hideEmailModal = false;
    clearInterval(this.emailInterval);
    this.emailCountdownTimer = 120;

    this.emailInterval = setInterval(() => {
      this.emailCountdownTimer--;
      if (this.emailCountdownTimer <= 0) {
        clearInterval(this.emailInterval);
      }
    }, 1000);

    this.userService
      .generateConfirmationCode(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {});
  }

  verifyEmail(verifyEmailModalForm: any) {
    this.showWaiting = true;
    this.userService
      .verifyEmail(this.currentUser, verifyEmailModalForm.value.code)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          verifyEmailModalForm.reset();
          this.showWaiting = false;
        })
      )
      .subscribe((response) => {
        this.hideEmailModal = true;
        this.ngOnInit();
        this.showEmailModal = true;
        document.getElementById("openEmailButton").click();
      });
  }

  resetEmailForm(verifyEmailModalForm: any) {
    verifyEmailModalForm.reset();
  }

  getTimeValue(currentDateTime: Date, postDateTime: Date) {
    let delta =
      Math.abs(postDateTime.getTime() - currentDateTime.getTime()) / 1000;
    let days = Math.floor(delta / 86400);
    if (days != 0) {
      if (days > 1) {
        return days + " days";
      } else {
        return days + " day";
      }
    }
    let hours = Math.floor(delta / 3600);
    if (hours != 0) {
      if (hours > 1) {
        return hours + " hours";
      } else {
        return hours + " hour";
      }
    }
    let minutes = Math.floor(delta / 60);
    if (minutes != 0) {
      if (minutes > 1) {
        return minutes + " minutes";
      } else {
        return minutes + " minute";
      }
    }
    let seconds = Math.floor(delta % 60);
    return seconds + " seconds";
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

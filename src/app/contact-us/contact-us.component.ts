import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ContactUs } from "../model/contact-us.model";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../services/notification.service";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
})
export class ContactUsComponent implements OnInit {
  isLoading = false;

  currentDateTime = new Date();

  contactUsRequest = new ContactUs();
  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.currentDateTime = new Date();
  }

  ngOnInit() {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  contactUs(contactUsForm: any) {
    this.isLoading = true;

    this.contactUsRequest.queryFirstName = contactUsForm.value.firstName;
    this.contactUsRequest.queryLastName = contactUsForm.value.lastName;
    this.contactUsRequest.queryEmail = contactUsForm.value.contactEmail;
    this.contactUsRequest.queryText = contactUsForm.value.contactQuestions;

    this.userService
      .sendQuery(this.contactUsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.notificationService.info(
          "We have received your questions in mail! You will receive a response from us shortly."
        );
        contactUsForm.reset();
      });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

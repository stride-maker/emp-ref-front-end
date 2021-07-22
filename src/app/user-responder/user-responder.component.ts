import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { AppliedJobService } from "../services/applied-job.service";
import FileSaver from "file-saver";
import { HttpErrorResponse } from "@angular/common/http";
import JSZip from "jszip";
import { NotificationService } from "../services/notification.service";
import { ResponseJob } from "../model/response-job.model";
import { Resume } from "../model/resume.model";
import { throwError } from "rxjs";

@Component({
  selector: "app-user-responder",
  templateUrl: "./user-responder.component.html",
  styleUrls: ["./user-responder.component.css"],
})
export class UserResponderComponent implements OnInit {
  currentUser: string;

  resumeUrl: string;

  isRefresh = false;
  showLoadingScreen = true;
  showLoadingJobs = false;

  items = [];
  pageOfItems: Array<any>;
  filterForAppStatus = {
    applied: false,
    referred: false,
  };
  filterForApplicantRange = {
    lessThanFifty: false,
    fiftyToHundred: false,
    hundredToOneFifty: false,
    oneFiftyToTwoHundred: false,
    twoHundredToTwoFifty: false,
    moreThanTwoFifty: false,
  };
  referredJobResponse: Array<ResponseJob>;
  filteredReferredJobResponse: Array<ResponseJob>;
  constructor(
    private appliedJobService: AppliedJobService,
    private notificationService: NotificationService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    this.showLoadingScreen = false;
    if (!this.isRefresh) {
      this.showLoadingJobs = true;
    }
    this.loadJobs();
  }

  loadJobs() {
    setTimeout(() => {
      this.appliedJobService
        .getAllRespond(this.currentUser)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.showLoadingJobs = false;
            this.isRefresh = false;
          })
        )
        .subscribe((response: Array<ResponseJob>) => {
          this.referredJobResponse = response;
          this.applyFilter();
        });
    }, 1500);
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  clearFilter() {
    this.filterForAppStatus = {
      applied: false,
      referred: false,
    };
    this.filterForApplicantRange = {
      lessThanFifty: false,
      fiftyToHundred: false,
      hundredToOneFifty: false,
      oneFiftyToTwoHundred: false,
      twoHundredToTwoFifty: false,
      moreThanTwoFifty: false,
    };
    this.applyFilter();
  }

  applyFilter() {
    this.filteredReferredJobResponse = this.referredJobResponse.filter(
      (job) => job.jobStatus === "Active"
    );
    if (this.filterForAppStatus.applied || this.filterForAppStatus.referred) {
      this.filteredReferredJobResponse = this.filteredReferredJobResponse.filter(
        (job) =>
          (job.applicants.some(
            (applicant) => applicant.applicationStatus === "Referred"
          ) &&
            this.filterForAppStatus.referred) ||
          (job.applicants.some(
            (applicant) => applicant.applicationStatus === "Applied"
          ) &&
            this.filterForAppStatus.applied)
      );
    }

    if (
      this.filterForApplicantRange.lessThanFifty ||
      this.filterForApplicantRange.fiftyToHundred ||
      this.filterForApplicantRange.hundredToOneFifty ||
      this.filterForApplicantRange.oneFiftyToTwoHundred ||
      this.filterForApplicantRange.twoHundredToTwoFifty ||
      this.filterForApplicantRange.moreThanTwoFifty
    ) {
      this.filteredReferredJobResponse = this.filteredReferredJobResponse.filter(
        (job) =>
          (parseInt(job.numberOfApplicants) < 50 &&
            this.filterForApplicantRange.lessThanFifty) ||
          (parseInt(job.numberOfApplicants) >= 50 &&
            parseInt(job.numberOfApplicants) < 100 &&
            this.filterForApplicantRange.fiftyToHundred) ||
          (parseInt(job.numberOfApplicants) >= 100 &&
            parseInt(job.numberOfApplicants) < 150 &&
            this.filterForApplicantRange.hundredToOneFifty) ||
          (parseInt(job.numberOfApplicants) >= 150 &&
            parseInt(job.numberOfApplicants) < 200 &&
            this.filterForApplicantRange.oneFiftyToTwoHundred) ||
          (parseInt(job.numberOfApplicants) >= 200 &&
            parseInt(job.numberOfApplicants) < 250 &&
            this.filterForApplicantRange.twoHundredToTwoFifty) ||
          (parseInt(job.numberOfApplicants) >= 250 &&
            this.filterForApplicantRange.moreThanTwoFifty)
      );
    }

    this.items = this.filteredReferredJobResponse;
  }

  changeToReferred(jobId: string, applicationId: string) {
    this.appliedJobService
      .changeOneApplicationStatus(jobId, applicationId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.ngOnInit();
      });
  }

  downloadCandidateResume(
    applicationId: string,
    firstName: string,
    lastName: string,
    createdDate: Date,
    applicationStatus: string
  ) {
    if (applicationStatus == "Applied") {
      this.notificationService.info("First, Please respond to applicant!");
    } else {
      this.appliedJobService
        .downloadCandidateResume(applicationId)
        .pipe(
          catchError(this.handleError),
          finalize(() => {})
        )
        .subscribe((response: Resume) => {
          const byteArray = new Uint8Array(
            atob(response.resume)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          let fileResume = new Blob([byteArray], {
            type: response.resumeFormat,
          });
          this.resumeUrl = URL.createObjectURL(fileResume);
          var link = document.createElement("a");
          link.href = this.resumeUrl;
          link.download =
            firstName + "_" + lastName + "_" + new Date(createdDate);
          link.click();
        });
    }
  }

  changeAllToReferred(jobId: string) {
    this.appliedJobService
      .changeAllApplicationStatus(jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.ngOnInit();
      });
  }

  downloadAllResumes(jobId: string, jobTitle: string) {
    this.appliedJobService
      .checkStatus(jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        if (!response) {
          this.notificationService.info("Please respond to all applicants!");
        } else {
          this.appliedJobService
            .downloadAllCandidateResume(jobId)
            .pipe(
              catchError(this.handleError),
              finalize(() => {})
            )
            .subscribe((response: Array<Resume>) => {
              let zip = new JSZip();
              let imageFolder = zip.folder(jobId);

              for (let resumeFile of response) {
                const byteArray = new Uint8Array(
                  atob(resumeFile.resume)
                    .split("")
                    .map((char) => char.charCodeAt(0))
                );
                let finalResume = new Blob([byteArray], {
                  type: resumeFile.resumeFormat,
                });

                imageFolder.file(resumeFile.resumeName, finalResume);
              }
              zip.generateAsync({ type: "blob" }).then(function (content) {
                FileSaver.saveAs(content, jobTitle + ".zip");
              });
            });
        }
      });
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

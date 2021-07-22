import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { AppliedJob } from "../model/applied-job.model";
import { AppliedJobService } from "../services/applied-job.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Resume } from "../model/resume.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-user-seeker",
  templateUrl: "./user-seeker.component.html",
  styleUrls: ["./user-seeker.component.css"],
})
export class UserSeekerComponent implements OnInit {
  currentUser: string;

  resumeUrl: string;
  resumeUrl1: string;
  resumeName: string;
  withdrawApplicationJobId: string;

  isRefresh = false;
  showLoadingScreen = true;
  showLoadingJobs = false;
  showDownloadingResume = false;
  showUpdatedResume = false;
  showWithdrawConfirmationModal = false;

  nowDate: any;
  todaysDate: any;
  yesterdayDate: any;
  lastSundayDate: any;
  lastWeekDate: any;
  lastMonthStartDate: any;
  lastMonthEndDate: any;
  lastYearStartDate: any;
  lastYearEndDate: any;

  items = [];
  pageOfItems: Array<any>;
  filterForJobStatus = {
    active: false,
    expired: false,
  };
  filterForAppStatus = {
    applied: false,
    referred: false,
  };
  filterForDates = {
    today: false,
    yesterday: false,
    thisWeek: false,
    lastWeek: false,
    thisMonth: false,
    lastMonth: false,
    thisYear: false,
    lastYear: false,
  };
  appliedJobResponse: Array<AppliedJob>;
  filteredAppliedJobResponse: Array<AppliedJob>;
  constructor(
    private userService: UserService,
    private appliedJobService: AppliedJobService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    this.nowDate = new Date();

    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);

    this.yesterdayDate = new Date();
    this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1);
    this.yesterdayDate.setHours(0, 0, 0, 0);

    this.lastSundayDate = new Date();
    this.lastSundayDate.setDate(
      this.lastSundayDate.getDate() - this.lastSundayDate.getDay()
    );
    this.lastSundayDate.setHours(23, 59, 59, 59);

    this.lastWeekDate = new Date(this.lastSundayDate);
    this.lastWeekDate.setDate(this.lastWeekDate.getDate() - 6);
    this.lastWeekDate.setHours(0, 0, 0, 0);

    this.lastMonthStartDate = new Date(
      this.nowDate.getFullYear(),
      this.nowDate.getMonth() - 1,
      1
    );
    this.lastMonthStartDate.setHours(0, 0, 0, 0);

    this.lastMonthEndDate = new Date(
      this.nowDate.getFullYear(),
      this.nowDate.getMonth(),
      0
    );
    this.lastMonthEndDate.setHours(23, 59, 59, 59);

    this.lastYearStartDate = new Date(this.nowDate.getFullYear() - 1, 0, 1);
    this.lastYearStartDate.setHours(0, 0, 0, 0);

    this.lastYearEndDate = new Date(this.nowDate.getFullYear(), 0, 1);
    this.lastYearEndDate.setHours(0, 0, 0, 0);

    this.userService
      .getResume(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((response: Resume) => {
        if (response.resume == null) {
          this.resumeName = null;
        } else {
          this.resumeName = response.resumeName;
        }
      });
    if (!this.isRefresh) {
      this.showLoadingJobs = true;
    }
    this.loadJobs();
  }

  loadJobs() {
    setTimeout(() => {
      this.appliedJobService
        .getAllApplied(this.currentUser)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.showLoadingJobs = false;
            this.isRefresh = false;
          })
        )
        .subscribe((response: Array<AppliedJob>) => {
          this.appliedJobResponse = response;
          this.applyFilter();
        });
    }, 1500);
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  clearFilter() {
    this.filterForJobStatus = {
      active: false,
      expired: false,
    };
    this.filterForAppStatus = {
      applied: false,
      referred: false,
    };
    this.filterForDates = {
      today: false,
      yesterday: false,
      thisWeek: false,
      lastWeek: false,
      thisMonth: false,
      lastMonth: false,
      thisYear: false,
      lastYear: false,
    };
    this.applyFilter();
  }

  applyFilter() {
    this.filteredAppliedJobResponse = this.appliedJobResponse;
    if (this.filterForJobStatus.active || this.filterForJobStatus.expired) {
      this.filteredAppliedJobResponse = this.filteredAppliedJobResponse.filter(
        (job) =>
          (job.jobStatus === "Active" && this.filterForJobStatus.active) ||
          (job.jobStatus === "Expired" && this.filterForJobStatus.expired)
      );
    }

    if (this.filterForAppStatus.applied || this.filterForAppStatus.referred) {
      this.filteredAppliedJobResponse = this.filteredAppliedJobResponse.filter(
        (job) =>
          (job.applicationStatus === "Applied" &&
            this.filterForAppStatus.applied) ||
          (job.applicationStatus === "Referred" &&
            this.filterForAppStatus.referred)
      );
    }

    if (
      this.filterForDates.today ||
      this.filterForDates.yesterday ||
      this.filterForDates.thisWeek ||
      this.filterForDates.lastWeek ||
      this.filterForDates.thisMonth ||
      this.filterForDates.lastMonth ||
      this.filterForDates.thisYear ||
      this.filterForDates.lastYear
    ) {
      this.filteredAppliedJobResponse = this.filteredAppliedJobResponse.filter(
        (job) =>
          (new Date(job.createdDate) <= this.nowDate &&
            new Date(job.createdDate) > this.todaysDate &&
            this.filterForDates.today) ||
          (new Date(job.createdDate) <= this.todaysDate &&
            new Date(job.createdDate) > this.yesterdayDate &&
            this.filterForDates.yesterday) ||
          (new Date(job.createdDate) <= this.nowDate &&
            new Date(job.createdDate) > this.lastSundayDate &&
            this.filterForDates.thisWeek) ||
          (new Date(job.createdDate) <= this.lastSundayDate &&
            new Date(job.createdDate) > this.lastWeekDate &&
            this.filterForDates.lastWeek) ||
          (new Date(job.createdDate) <= this.nowDate &&
            new Date(job.createdDate) > this.lastMonthEndDate &&
            this.filterForDates.thisMonth) ||
          (new Date(job.createdDate) <= this.lastMonthEndDate &&
            new Date(job.createdDate) > this.lastMonthStartDate &&
            this.filterForDates.lastMonth) ||
          (new Date(job.createdDate) <= this.nowDate &&
            new Date(job.createdDate) > this.lastYearEndDate &&
            this.filterForDates.thisYear) ||
          (new Date(job.createdDate) <= this.lastYearEndDate &&
            new Date(job.createdDate) > this.lastYearStartDate &&
            this.filterForDates.lastYear)
      );
    }
    this.filteredAppliedJobResponse.sort((a, b) => {
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    });

    this.items = this.filteredAppliedJobResponse;
  }

  downloadResume(jobId: string) {
    this.showDownloadingResume = true;
    this.appliedJobService
      .downloadResume(this.currentUser, jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showDownloadingResume = false;
        })
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
        link.download = response.resumeName;
        link.click();
      });
  }

  getUpdatedResume() {
    this.showUpdatedResume = true;
    this.userService
      .getResume(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showUpdatedResume = false;
        })
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
        this.resumeUrl1 = URL.createObjectURL(fileResume);
        var link = document.createElement("a");
        link.href = this.resumeUrl1;
        link.download = response.resumeName;
        link.click();
      });
  }

  withdrawApplication() {
    this.appliedJobService
      .withdrawApplication(this.currentUser, this.withdrawApplicationJobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.ngOnInit();
      });
  }

  fillConfirmationModal(jobId: string) {
    this.withdrawApplicationJobId = jobId;
    this.showWithdrawConfirmationModal = true;
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

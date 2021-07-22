import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { JobParent } from "../model/job-parent.model";
import { JobParentService } from "../services/job-parent.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-view-job",
  templateUrl: "./view-job.component.html",
  styleUrls: ["./view-job.component.css"],
})
export class ViewJobComponent implements OnInit {
  currentUser: string;

  showLoadingScreen = true;

  jobId: string;

  job = new JobParent();
  constructor(
    private activatedRoute: ActivatedRoute,
    private jobParentService: JobParentService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
    this.activatedRoute.queryParams.subscribe((params) => {
      this.jobId = params["jobId"];
    });
  }

  ngOnInit() {
    this.jobParentService
      .getJob(this.jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((response: JobParent) => {
        this.job = response;
      });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

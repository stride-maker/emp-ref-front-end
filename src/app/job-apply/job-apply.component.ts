import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ActivatedRoute } from "@angular/router";
import { AppliedJobService } from "../services/applied-job.service";
import { HttpErrorResponse } from "@angular/common/http";
import { JobParent } from "../model/job-parent.model";
import { JobParentService } from "../services/job-parent.service";
import { NotificationService } from "../services/notification.service";
import { Resume } from "../model/resume.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-job-apply",
  templateUrl: "./job-apply.component.html",
  styleUrls: ["./job-apply.component.css"],
})
export class JobApplyComponent implements OnInit {
  currentUser: string;

  isResume = false;
  showLoadingScreen = true;
  showApplying = false;
  showFetching = false;
  showPDFResumeIcon = false;
  showWordResumeIcon = false;
  showLoadingResume = false;
  showSavingResume = false;
  showApplyJobModal = false;
  showAlreadyAppliedJobModal = false;
  showAppliedJobModal = false;
  showEmailVerifyModal = false;

  jobId: string;
  resumeName: string;
  currentJobApplicationJobId: string;

  uploadedResume = null;
  job = new JobParent();
  constructor(
    private activatedRoute: ActivatedRoute,
    private jobParentService: JobParentService,
    private notificationService: NotificationService,
    private userService: UserService,
    private appliedJobService: AppliedJobService
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

  onUpdateResume(event: any) {
    this.uploadedResume = event.target.files[0];

    if (this.uploadedResume) {
      if (
        this.uploadedResume.type == "application/msword" ||
        this.uploadedResume.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        this.uploadedResume.type == "application/pdf"
      ) {
        this.showSavingResume = true;
        let reader = new FileReader();

        reader.readAsDataURL(this.uploadedResume);

        const uploadResumeData = new FormData();
        uploadResumeData.append("resume", this.uploadedResume);

        this.userService
          .saveResume(
            uploadResumeData,
            this.currentUser,
            this.uploadedResume.name
          )
          .pipe(
            catchError(this.handleError),
            finalize(() => {
              this.showSavingResume = false;
            })
          )
          .subscribe((response) => {
            this.ngOnInit();
          });

        this.resumeName = null;
        this.showPDFResumeIcon = false;
        this.showWordResumeIcon = false;

        if (
          this.uploadedResume.type == "application/msword" ||
          this.uploadedResume.type ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          this.showWordResumeIcon = true;
          this.resumeName = this.uploadedResume.name;
        } else {
          this.showPDFResumeIcon = true;
          this.resumeName = this.uploadedResume.name;
        }
        this.isResume = true;
      } else {
        this.notificationService.error("Invalid resume format!");
      }
    }
  }

  applyForJob() {
    this.showApplying = true;
    this.appliedJobService
      .createApplication(this.currentUser, this.currentJobApplicationJobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showApplying = false;
        })
      )
      .subscribe((response) => {
        document.getElementById("appliedJobButton").click();
      });
  }

  validateApplication(jobId: string) {
    this.showFetching = true;
    this.currentJobApplicationJobId = jobId;
    this.appliedJobService
      .validate(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        if (!response) {
          document.getElementById("emailVerifyButton").click();
          this.showFetching = false;
        } else {
          this.alreadyAppliedOnApplication(jobId);
        }
      });
  }

  alreadyAppliedOnApplication(jobId: string) {
    this.appliedJobService
      .alreadyApplied(this.currentUser, jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showFetching = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          document.getElementById("alreadyAppliedJobButton").click();
        } else {
          document.getElementById("applyJobButton").click();
        }
      });
  }

  openApplyJobModal() {
    this.showApplyJobModal = true;
    this.isResume = true;
    this.resumeName = null;
    this.showPDFResumeIcon = false;
    this.showWordResumeIcon = false;
    this.showLoadingResume = true;
    this.userService
      .getResume(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingResume = false;
        })
      )
      .subscribe((response: Resume) => {
        if (response.resume == null) {
          this.isResume = false;
        } else {
          this.isResume = true;
          this.resumeName = response.resumeName;
          if (
            response.resumeFormat == "application/msword" ||
            response.resumeFormat ==
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            this.showWordResumeIcon = true;
          } else {
            this.showPDFResumeIcon = true;
          }
        }
      });
  }

  openEmailVerifyModal(value: boolean) {
    this.showEmailVerifyModal = value;
  }

  openAlreadyAppliedJobModal(value: boolean) {
    this.showAlreadyAppliedJobModal = value;
  }

  openAppliedJobModal(value: boolean) {
    this.showAppliedJobModal = value;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

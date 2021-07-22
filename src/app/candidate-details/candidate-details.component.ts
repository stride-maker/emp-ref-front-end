import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { ActivatedRoute } from "@angular/router";
import { AppliedJobService } from "../services/applied-job.service";
import FileSaver from "file-saver";
import { HttpErrorResponse } from "@angular/common/http";
import JSZip from "jszip";
import { NotificationService } from "../services/notification.service";
import { ResponseJob } from "../model/response-job.model";
import { Resume } from "../model/resume.model";
import { throwError } from "rxjs";

@Component({
  selector: "app-candidate-details",
  templateUrl: "./candidate-details.component.html",
  styleUrls: ["./candidate-details.component.css"],
})
export class CandidateDetailsComponent implements OnInit {
  currentUser: string;

  showLoadingScreen = true;

  jobId: string;

  job = new ResponseJob();
  constructor(
    private activatedRoute: ActivatedRoute,
    private appliedJobService: AppliedJobService,
    private notificationService: NotificationService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
    this.activatedRoute.queryParams.subscribe((params) => {
      this.jobId = params["jobId"];
    });
  }

  ngOnInit() {
    this.appliedJobService
      .getRespond(this.jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((response: ResponseJob) => {
        this.job = response;
      });
  }

  changeAllToReferred(jobId: string) {
    this.appliedJobService
      .changeAllApplicationStatus(jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
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

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

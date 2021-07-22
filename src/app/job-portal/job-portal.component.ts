import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { HttpErrorResponse } from "@angular/common/http";
import { JobCard } from "../model/job-card.model";
import { JobCardService } from "../services/job-card.service";
import { JobCount } from "../model/job-count.model";
import { Skill } from "../model/skill.model";
import { UserService } from "../services/user.service";
import { UserSkillService } from "../services/user-skill.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-job-portal",
  templateUrl: "./job-portal.component.html",
  styleUrls: ["./job-portal.component.css"],
})
export class JobPortalComponent implements OnInit {
  currentUser: string;

  showLoadingScreen = true;
  showLoadingJobs = false;
  skillsPresentForUser = true;

  items = [];
  pageOfItems: Array<any>;
  jobCount = new JobCount();
  allJobCardResponses: JobCard[] = [];
  filteredAllJobCardResponses: JobCard[] = [];
  constructor(
    private userService: UserService,
    private userSkillService: UserSkillService,
    private jobCardService: JobCardService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    this.userService
      .getJobCount()
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response: JobCount) => {
        this.jobCount = response;
      });

    this.userSkillService
      .getAllSkillsByUserId(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((responses: Array<Skill>) => {
        if (responses.length == 0) {
          this.skillsPresentForUser = false;
        }
      });

    if (this.skillsPresentForUser) {
      this.showLoadingJobs = true;
      this.loadJobs();
    }
  }

  loadJobs() {
    setTimeout(() => {
      this.jobCardService
        .getAllSkillJobs(this.currentUser)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.showLoadingJobs = false;
          })
        )
        .subscribe((responses: Array<JobCard>) => {
          for (let response of responses) {
            if (
              response.jobCardStatus == "Active" &&
              response.email.localeCompare(this.currentUser)
            ) {
              this.allJobCardResponses.push(response);
            }
          }
          this.allJobCardResponses.sort((a, b) => {
            return (
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
            );
          });
        });
    }, 1500);
    this.filteredAllJobCardResponses = this.allJobCardResponses;
    this.items = this.filteredAllJobCardResponses;
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  changeLocationFilter(value: string) {
    this.showLoadingJobs = true;
    setTimeout(() => {
      this.filteredAllJobCardResponses = this.allJobCardResponses;
      this.filteredAllJobCardResponses = this.filteredAllJobCardResponses.filter(
        (jobCard) => jobCard.jobCardLocation === value
      );
      this.filteredAllJobCardResponses.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });
      this.items = this.filteredAllJobCardResponses;
      this.showLoadingJobs = false;
    }, 1000);
  }

  changeExperienceFilter(minValue: string, maxValue: string) {
    this.showLoadingJobs = true;
    setTimeout(() => {
      this.filteredAllJobCardResponses = this.allJobCardResponses;
      this.filteredAllJobCardResponses = this.filteredAllJobCardResponses.filter(
        (jobCard) =>
          jobCard.jobCardMinExperience === minValue ||
          jobCard.jobCardMinExperience === maxValue
      );
      this.filteredAllJobCardResponses.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });
      this.items = this.filteredAllJobCardResponses;
      this.showLoadingJobs = false;
    }, 1000);
  }

  changeDesignationFilter(value: string) {
    this.showLoadingJobs = true;
    setTimeout(() => {
      this.filteredAllJobCardResponses = this.allJobCardResponses;
      this.filteredAllJobCardResponses = this.filteredAllJobCardResponses.filter(
        (jobCard) =>
          jobCard.jobCardDesignation.trim().toLowerCase() ===
          value.trim().toLowerCase()
      );
      this.filteredAllJobCardResponses.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });
      this.items = this.filteredAllJobCardResponses;
      this.showLoadingJobs = false;
    }, 1000);
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

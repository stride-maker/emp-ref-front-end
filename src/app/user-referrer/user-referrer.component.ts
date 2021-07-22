import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { AppliedJobService } from "../services/applied-job.service";
import { HttpErrorResponse } from "@angular/common/http";
import { JobCard } from "../model/job-card.model";
import { JobCardService } from "../services/job-card.service";
import { JobParent } from "../model/job-parent.model";
import { JobParentService } from "../services/job-parent.service";
import { JobSkill } from "../model/job-skill.model";
import { throwError } from "rxjs";

@Component({
  selector: "app-user-referrer",
  templateUrl: "./user-referrer.component.html",
  styleUrls: ["./user-referrer.component.css"],
})
export class UserReferrerComponent implements OnInit {
  currentUser: string;

  isRefresh = false;
  showLoadingScreen = true;
  showLoadingJobs = false;
  showEditJobScreen = false;
  modalJobSecondarySkill = "";
  editModalJobSecondarySkill = "";
  showEditJobModal = false;
  showDeleteJobConfirmationModal = false;

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
  filterForJob = {
    active: false,
    expired: false,
  };
  filterForLocations = {
    bengaluru: false,
    delhi: false,
    chennai: false,
    hyderabad: false,
    gurgaon: false,
    pune: false,
    mumbai: false,
    ahmedabad: false,
    kolkata: false,
    noida: false,
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
  locations: string[] = [
    "Bengaluru",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Gurgaon",
    "Pune",
    "Mumbai",
    "Ahmedabad",
    "Kolkata",
    "Noida",
  ];
  expYears: string[] = [
    "0 year",
    "1 year",
    "2 year",
    "3 year",
    "4 year",
    "5 year",
    "6 year",
    "7 year",
    "8 year",
    "9 year",
    "10 year",
    "11 year",
    "12 year",
    "13 year",
    "14 year",
    "15 year",
  ];
  skills: string[] = [
    "HTML",
    "CSS",
    "C Language",
    "Embedded C",
    "PHP",
    "Python",
    "JavaScript",
    "Java",
    "Ruby",
    "C#",
    "SQL",
    "C++",
    "React",
    "Angular",
    "Big Data",
    "DevOps",
    "RPA (Robotic Process Automation)",
    "Artificial Intelligence",
    "Internet of Things (IoT)",
    "Blockchain",
    "Android",
    "Machine Learning",
  ];
  editJobId: string;
  editJobPrimarySkill: string;
  jobSecondarySkillSet: string[] = [];
  editJobSecondarySkillSet: string[] = [];

  jobSkillsRequest: Array<JobSkill> = [];
  editJobSkillsRequest: Array<JobSkill> = [];
  editJobSkillsModal: Array<JobSkill> = [];
  jobParentRequest = new JobParent();
  editJobParentModal = new JobParent();
  editJobParentRequest = new JobParent();
  jobCardResponse: Array<JobCard>;
  filteredJobCardResponse: Array<JobCard>;
  jobCardSkillResponse: Array<JobCard>;
  jobCardPrimarySkill = new JobSkill();
  jobCardAdditionalSkills: Array<JobSkill>;
  jobCardToBeDeleted = new JobCard();
  constructor(
    private jobCardService: JobCardService,
    private jobParentService: JobParentService,
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

    this.showLoadingScreen = false;
    if (!this.isRefresh) {
      this.showLoadingJobs = true;
    }
    this.loadJobs();
  }

  loadJobs() {
    setTimeout(() => {
      this.jobCardService
        .getAllReferredJobs(this.currentUser)
        .pipe(
          catchError(this.handleError),
          finalize(() => {
            this.showLoadingJobs = false;
            this.isRefresh = false;
          })
        )
        .subscribe((response: Array<JobCard>) => {
          this.jobCardResponse = response;
          this.applyFilter();
        });
    }, 1500);
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  clearFilter() {
    this.filterForJob = {
      active: false,
      expired: false,
    };
    this.filterForLocations = {
      bengaluru: false,
      delhi: false,
      chennai: false,
      hyderabad: false,
      gurgaon: false,
      pune: false,
      mumbai: false,
      ahmedabad: false,
      kolkata: false,
      noida: false,
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
    this.filteredJobCardResponse = this.jobCardResponse;
    if (this.filterForJob.active || this.filterForJob.expired) {
      this.filteredJobCardResponse = this.filteredJobCardResponse.filter(
        (job) =>
          (job.jobCardStatus === "Active" && this.filterForJob.active) ||
          (job.jobCardStatus === "Expired" && this.filterForJob.expired)
      );
    }

    if (
      this.filterForLocations.bengaluru ||
      this.filterForLocations.delhi ||
      this.filterForLocations.chennai ||
      this.filterForLocations.hyderabad ||
      this.filterForLocations.gurgaon ||
      this.filterForLocations.pune ||
      this.filterForLocations.mumbai ||
      this.filterForLocations.ahmedabad ||
      this.filterForLocations.kolkata ||
      this.filterForLocations.noida
    ) {
      this.filteredJobCardResponse = this.filteredJobCardResponse.filter(
        (job) =>
          (job.jobCardLocation === "Bengaluru" &&
            this.filterForLocations.bengaluru) ||
          (job.jobCardLocation === "Chennai" &&
            this.filterForLocations.chennai) ||
          (job.jobCardLocation === "Hyderabad" &&
            this.filterForLocations.hyderabad) ||
          (job.jobCardLocation === "Gurgaon" &&
            this.filterForLocations.gurgaon) ||
          (job.jobCardLocation === "Mumbai" &&
            this.filterForLocations.mumbai) ||
          (job.jobCardLocation === "Ahmedabad" &&
            this.filterForLocations.ahmedabad) ||
          (job.jobCardLocation === "Kolkata" &&
            this.filterForLocations.kolkata) ||
          (job.jobCardLocation === "Delhi" && this.filterForLocations.delhi) ||
          (job.jobCardLocation === "Pune" && this.filterForLocations.pune) ||
          (job.jobCardLocation === "Noida" && this.filterForLocations.noida)
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
      this.filteredJobCardResponse = this.filteredJobCardResponse.filter(
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
    this.filteredJobCardResponse.sort((a, b) => {
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    });

    this.items = this.filteredJobCardResponse;
  }

  validateExperience(minExperience: string, maxExperience: string) {
    if (minExperience == "" || maxExperience == "") return false;
    let minIndex = this.expYears.indexOf(minExperience);
    let maxIndex = this.expYears.indexOf(maxExperience);
    if (minIndex > maxIndex) return true;
    return false;
  }

  addJobToReferrals(addReferJobModalForm: any, skillForm: any) {
    this.jobParentRequest.email = this.currentUser;
    this.jobParentRequest.jobTitle = addReferJobModalForm.value.modalJobTitle;
    this.jobParentRequest.jobDesignation =
      addReferJobModalForm.value.modalJobDesignation;
    this.jobParentRequest.jobOrganization =
      addReferJobModalForm.value.modalJobOrganization;
    this.jobParentRequest.jobMinExperience =
      addReferJobModalForm.value.modalJobMinExperience;
    this.jobParentRequest.jobMaxExperience =
      addReferJobModalForm.value.modalJobMaxExperience;
    this.jobParentRequest.jobLocation =
      addReferJobModalForm.value.modalJobLocation;
    this.jobParentRequest.jobCompanyUrl =
      addReferJobModalForm.value.modalJobCompanyUrl;
    this.jobParentRequest.jobStatus = "Active";
    this.jobParentRequest.jobDescription =
      addReferJobModalForm.value.modalJobDescription;
    this.jobParentRequest.jobRole = addReferJobModalForm.value.modalJobRole;
    this.jobParentRequest.jobUGDescription =
      addReferJobModalForm.value.modalJobUGDescription;
    this.jobParentRequest.jobPGDescription =
      addReferJobModalForm.value.modalJobPGDescription;
    this.jobParentRequest.jobAboutCompany =
      addReferJobModalForm.value.modalJobAboutCompany;

    let jobPrimarySkill = new JobSkill();
    jobPrimarySkill.jobSkillName = skillForm.value.modalJobPrimarySkill;
    jobPrimarySkill.jobSkillType = "Primary";
    this.jobSkillsRequest.push(jobPrimarySkill);

    for (let skill of this.jobSecondarySkillSet) {
      let secondarySkill = new JobSkill();
      secondarySkill.jobSkillName = skill;
      secondarySkill.jobSkillType = "Secondary";
      this.jobSkillsRequest.push(secondarySkill);
    }
    this.jobParentRequest.jobSkills = this.jobSkillsRequest;

    this.jobParentService
      .createJob(this.jobParentRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.jobSecondarySkillSet = [];
          this.jobSkillsRequest = [];
        })
      )
      .subscribe((response) => {
        this.jobSecondarySkillSet = [];
        this.jobSkillsRequest = [];
        addReferJobModalForm.reset();
        skillForm.reset();
        this.ngOnInit();
      });
  }

  editJobReferral(editReferJobModalForm: any, editSkillForm: any) {
    this.editJobParentRequest.email = this.currentUser;
    this.editJobParentRequest.jobId = this.editJobId;
    this.editJobParentRequest.jobTitle =
      editReferJobModalForm.value.editModalJobTitle;
    this.editJobParentRequest.jobDesignation =
      editReferJobModalForm.value.editModalJobDesignation;
    this.editJobParentRequest.jobOrganization =
      editReferJobModalForm.value.editModalJobOrganization;
    this.editJobParentRequest.jobMinExperience =
      editReferJobModalForm.value.editModalJobMinExperience;
    this.editJobParentRequest.jobMaxExperience =
      editReferJobModalForm.value.editModalJobMaxExperience;
    this.editJobParentRequest.jobLocation =
      editReferJobModalForm.value.editModalJobLocation;
    this.editJobParentRequest.jobCompanyUrl =
      editReferJobModalForm.value.editModalJobCompanyUrl;
    this.editJobParentRequest.jobStatus = "Active";
    this.editJobParentRequest.jobDescription =
      editReferJobModalForm.value.editModalJobDescription;
    this.editJobParentRequest.jobRole =
      editReferJobModalForm.value.editModalJobRole;
    this.editJobParentRequest.jobUGDescription =
      editReferJobModalForm.value.editModalJobUGDescription;
    this.editJobParentRequest.jobPGDescription =
      editReferJobModalForm.value.editModalJobPGDescription;
    this.editJobParentRequest.jobAboutCompany =
      editReferJobModalForm.value.editModalJobAboutCompany;

    let editJobPrimarySkill = new JobSkill();
    editJobPrimarySkill.jobSkillName =
      editSkillForm.value.editModalJobPrimarySkill;
    editJobPrimarySkill.jobSkillType = "Primary";
    this.editJobSkillsRequest.push(editJobPrimarySkill);

    for (let jobSkill of this.editJobSecondarySkillSet) {
      let editSecondarySkill = new JobSkill();
      editSecondarySkill.jobSkillName = jobSkill;
      editSecondarySkill.jobSkillType = "Secondary";
      this.editJobSkillsRequest.push(editSecondarySkill);
    }
    this.editJobParentRequest.jobSkills = this.editJobSkillsRequest;

    this.jobParentService
      .updateJob(this.editJobParentRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.jobSecondarySkillSet = [];
          this.jobSkillsRequest = [];
        })
      )
      .subscribe((response) => {
        this.editJobSecondarySkillSet = [];
        this.editJobSkillsRequest = [];
        editReferJobModalForm.reset();
        editSkillForm.reset();
        this.ngOnInit();

        this.appliedJobService
          .updateApplication(this.editJobParentRequest.jobId)
          .pipe(
            catchError(this.handleError),
            finalize(() => {})
          )
          .subscribe((response) => {});
      });
  }

  openEditJobModal(jobCard: JobCard) {
    this.showEditJobScreen = true;
    this.jobParentService
      .getJob(jobCard.jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showEditJobScreen = false;
        })
      )
      .subscribe((response: JobParent) => {
        this.editJobParentModal = response;
        this.editJobId = this.editJobParentModal.jobId;
        this.editJobSkillsModal = this.editJobParentModal.jobSkills;
        for (let jobSkill of this.editJobSkillsModal) {
          if (jobSkill.jobSkillType == "Primary") {
            this.editJobPrimarySkill = jobSkill.jobSkillName;
          } else {
            if (!this.editJobSecondarySkillSet.includes(jobSkill.jobSkillName))
              this.editJobSecondarySkillSet.push(jobSkill.jobSkillName);
          }
        }
      });
  }

  fillSecondarySkillSet(skillForm: any) {
    if (
      skillForm.value.modalJobSecondarySkill != "" &&
      !this.jobSecondarySkillSet.includes(
        skillForm.value.modalJobSecondarySkill
      )
    ) {
      this.jobSecondarySkillSet.push(skillForm.value.modalJobSecondarySkill);
    }
    this.modalJobSecondarySkill = "";
  }

  updateSecondarySkillSet(secondarySkill: any) {
    let index = this.jobSecondarySkillSet.indexOf(secondarySkill);
    this.jobSecondarySkillSet.splice(index, 1);
  }

  fillEditSecondarySkillSet(editSkillForm: any) {
    if (
      editSkillForm.value.editModalJobSecondarySkill != "" &&
      !this.editJobSecondarySkillSet.includes(
        editSkillForm.value.editModalJobSecondarySkill
      )
    ) {
      this.editJobSecondarySkillSet.push(
        editSkillForm.value.editModalJobSecondarySkill
      );
    }
    this.editModalJobSecondarySkill = "";
  }

  updateEditSecondarySkillSet(secondarySkill: any) {
    let index = this.editJobSecondarySkillSet.indexOf(secondarySkill);
    this.editJobSecondarySkillSet.splice(index, 1);
  }

  setActiveStatus(jobCard: JobCard) {
    this.jobCardService
      .editStatus(jobCard.jobId, "Active")
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.appliedJobService
          .updateApplication(jobCard.jobId)
          .pipe(
            catchError(this.handleError),
            finalize(() => {})
          )
          .subscribe((response) => {});
        this.ngOnInit();
      });
  }

  setExpiredStatus(jobCard: JobCard) {
    this.jobCardService
      .editStatus(jobCard.jobId, "Expired")
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.appliedJobService
          .updateApplication(jobCard.jobId)
          .pipe(
            catchError(this.handleError),
            finalize(() => {})
          )
          .subscribe((response) => {});
        this.ngOnInit();
      });
  }

  deleteThisJob() {
    this.jobCardService
      .deleteJob(this.jobCardToBeDeleted.jobId)
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      )
      .subscribe((response) => {
        this.isRefresh = true;
        this.appliedJobService
          .updateJobStatus(this.jobCardToBeDeleted.jobId)
          .pipe(
            catchError(this.handleError),
            finalize(() => {})
          )
          .subscribe((response) => {});
        this.ngOnInit();
      });
  }

  fillConfirmationModal(jobCard: JobCard) {
    this.jobCardToBeDeleted = jobCard;
    this.showDeleteJobConfirmationModal = true;
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

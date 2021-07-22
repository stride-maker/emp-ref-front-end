import { Component, OnInit } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";

import { DatePipe } from "@angular/common";
import { Education } from "../model/education.model";
import { EducationService } from "../services/education.service";
import { Employment } from "../model/employment.model";
import { EmploymentService } from "../services/employment.service";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../services/notification.service";
import { Personal } from "../model/personal.model";
import { Resume } from "../model/resume.model";
import { Skill } from "../model/skill.model";
import { UserBasicDetails } from "../model/user-basic-details.model";
import { UserService } from "../services/user.service";
import { throwError } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  currentUser: string;

  isBasicDetails = false;
  isResume = false;
  isDownloadResume = false;
  isDeleteResume = false;
  isEmployment = false;
  isDeleteEmployment = false;
  isMasterEducation = false;
  isBachelorEducation = false;
  isSeniorSecEducation = false;
  isSecondaryEducation = false;
  isPersonal = false;
  isSkills = false;
  showLoadingScreen = true;
  showBasicDetailsScreen = false;
  showEmploymentDetailsScreen = false;
  showPosition = false;
  showDateOfBirth = false;
  showPhoneNumber = false;
  showCurrentLocation = false;
  showCurrentExperience = false;
  showResumePdf = false;
  showResumeWord = false;
  showEditDetailsModel = false;
  showEditEmploymentModel = false;
  empModelCurrentJob = false;
  imageProgress = 0;
  basicDetailsProgress = 0;
  resumeProgress = 0;
  currentEmploymentProgress = 0;
  employmentProgress = 0;
  masterEducationProgress = 0;
  bachelorEducationProgress = 0;
  seniorSecondaryProgress = 0;
  secondaryProgress = 0;
  personalDetailProgress = 0;
  skillsProgress = 0;
  progressValue = 0;
  editEmploymentModelId = 0;
  secondarySkillShown = "";

  genders: string[] = ["", "Male", "Female", "Other"];
  locations: string[] = [
    "",
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
    "",
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
  years: string[] = [
    "",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
  ];
  months: string[] = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  notices: string[] = [
    "",
    "1 Month",
    "2 Month",
    "3 Month",
    "More than 3 Months",
    "Serving Notice Period",
  ];
  streams: string[] = [
    "",
    "Commerce",
    "Biology",
    "Computer Science",
    "Maths",
    "Humanities",
  ];
  marks: string[] = [
    "",
    "< 40%",
    "40 - 44.9%",
    "45 - 49.9%",
    "50 - 54.9%",
    "55 - 59.9%",
    "60 - 64.9%",
    "65 - 69.9%",
    "70 - 74.9%",
    "75 - 79.9%",
    "80 - 84.9%",
    "85 - 89.9%",
    "90 - 94.9%",
    "95 - 99.9%",
    "100%",
  ];
  maritalStatuses: string[] = [
    "",
    "Single",
    "Married",
    "Seperated",
    "Divorced",
  ];
  skills: string[] = [
    "",
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
    "Other",
  ];
  userPrimarySkill: string;
  userSecondarySkillSet: string[] = [];
  imageUrl: string;
  resumeUrl: string;
  selectedFile: File;
  uploadedResume: File;
  resumeName: string;
  currentDesignation: string;
  currentOrganization: string;
  shownDateOfBirth: string;

  userEmpResponse: Array<Employment>;
  userSortedEmpResponse: Array<Employment>;
  userEduResponse: Array<Education>;
  userSkillsRequest: Array<Skill> = [];
  userSkillsResponse: Array<Skill>;
  userEmpDetailsModel = new Employment();
  userEmpDetailsRequest = new Employment();
  userMasterEduDetailsRequest = new Education();
  userBachelorEduDetailsRequest = new Education();
  userIntermediateEduDetailsRequest = new Education();
  userSecondaryEduDetailsRequest = new Education();
  userPersonalDetailRequest = new Personal();
  userMasterEduDetailsResponse = new Education();
  userBachelorEduDetailsResponse = new Education();
  userIntermediateEduDetailsResponse = new Education();
  userSecondaryEduDetailsResponse = new Education();
  userBasicDetailsResponse = new UserBasicDetails();
  userBasicDetailsModel = new UserBasicDetails();
  userBasicDetailsRequest = new UserBasicDetails();
  constructor(
    private datePipe: DatePipe,
    private userService: UserService,
    private notificationService: NotificationService,
    private employmentService: EmploymentService,
    private educationService: EducationService
  ) {
    this.currentUser = localStorage.getItem("login-id-user");
  }

  ngOnInit() {
    this.userService
      .getUser(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showLoadingScreen = false;
        })
      )
      .subscribe((response: UserBasicDetails) => {
        this.currentDesignation = null;
        this.currentOrganization = null;
        this.userBasicDetailsResponse = response;
        this.userEmpResponse = this.userBasicDetailsResponse.employments;
        this.userEduResponse = this.userBasicDetailsResponse.educations;
        this.userSkillsResponse = this.userBasicDetailsResponse.skills;
        this.userSortedEmpResponse = this.userEmpResponse.sort(
          (a, b): number => {
            if (b.startYear != a.startYear) {
              return b.startYear.localeCompare(a.startYear);
            } else {
              return (
                this.months.indexOf(b.startMonth) -
                this.months.indexOf(a.startMonth)
              );
            }
          }
        );
        this.showPosition = false;
        for (let emp of this.userSortedEmpResponse) {
          if (emp.currentJob) {
            this.currentDesignation = emp.designation;
            this.currentOrganization = emp.organization;
            this.showPosition = true;
          }
        }
        for (let edu of this.userEduResponse) {
          if (edu.education == "Masters/Post-Graduation")
            this.userMasterEduDetailsResponse = edu;
          else if (edu.education == "Graduation/Diploma")
            this.userBachelorEduDetailsResponse = edu;
          else if (edu.education == "12th Standard/Intermediate")
            this.userIntermediateEduDetailsResponse = edu;
          else if (edu.education == "10th Standard/Secondary")
            this.userSecondaryEduDetailsResponse = edu;
        }
        for (let skill of this.userSkillsResponse) {
          if (skill.skillType == "Primary") {
            this.userPrimarySkill = skill.skillName;
          } else {
            if (!this.userSecondarySkillSet.includes(skill.skillName))
              this.userSecondarySkillSet.push(skill.skillName);
          }
        }
        if (this.userBasicDetailsResponse.dateOfBirth != null) {
          let receivedDate: Date = new Date(
            this.userBasicDetailsResponse.dateOfBirth
          );
          this.shownDateOfBirth = this.datePipe.transform(
            receivedDate,
            "yyyy-MM-dd"
          );
          this.showDateOfBirth = true;
        }
        if (this.userBasicDetailsResponse.phoneNumber != null) {
          this.showPhoneNumber = true;
        }
        if (this.userBasicDetailsResponse.currentLocation != null) {
          this.showCurrentLocation = true;
        }
        if (this.userBasicDetailsResponse.currentExperience != null) {
          this.showCurrentExperience = true;
        }
        if (this.userBasicDetailsResponse.profileImage == null) {
          this.imageUrl = "/assets/images/profile.jpg";
        } else {
          this.imageUrl =
            "data:image/jpeg;base64," +
            this.userBasicDetailsResponse.profileImage;
        }
        if (this.userBasicDetailsResponse.resume != null) {
          this.resumeName = this.userBasicDetailsResponse.resumeName;
          if (this.userBasicDetailsResponse.resumeFormat == "application/pdf") {
            this.showResumePdf = true;
          } else {
            this.showResumeWord = true;
          }
        }
        this.loadProgressBar(this.userBasicDetailsResponse);
        this.progressValue =
          this.imageProgress +
          this.basicDetailsProgress +
          this.resumeProgress +
          this.currentEmploymentProgress +
          this.employmentProgress +
          this.masterEducationProgress +
          this.bachelorEducationProgress +
          this.seniorSecondaryProgress +
          this.secondaryProgress +
          this.personalDetailProgress +
          this.skillsProgress;
        this.showLoadingScreen = false;
      });
  }

  private loadProgressBar(userBasicDetailsResponse: any) {
    if (userBasicDetailsResponse.profileImage) {
      this.imageProgress = 5;
    }
    if (
      userBasicDetailsResponse.phoneNumber &&
      userBasicDetailsResponse.dateOfBirth &&
      userBasicDetailsResponse.currentLocation &&
      userBasicDetailsResponse.currentExperience
    ) {
      this.basicDetailsProgress = 10;
    }
    if (userBasicDetailsResponse.resume) {
      this.resumeProgress = 15;
    }
    if (this.currentDesignation && this.currentOrganization) {
      this.currentEmploymentProgress = 10;
    }
    if (userBasicDetailsResponse.employments.length != 0) {
      this.employmentProgress = 10;
    }
    if (this.userMasterEduDetailsResponse.education) {
      this.masterEducationProgress = 0;
    }
    if (this.userBachelorEduDetailsResponse.education) {
      this.bachelorEducationProgress = 10;
    }
    if (this.userIntermediateEduDetailsResponse.education) {
      this.seniorSecondaryProgress = 5;
    }
    if (this.userSecondaryEduDetailsResponse.education) {
      this.secondaryProgress = 5;
    }
    if (
      userBasicDetailsResponse.gender &&
      userBasicDetailsResponse.maritalStatus &&
      userBasicDetailsResponse.hometown &&
      userBasicDetailsResponse.pinCode
    ) {
      this.personalDetailProgress = 15;
    }
    if (userBasicDetailsResponse.skills.length != 0) {
      this.skillsProgress = 15;
    }
  }

  openEditDetailsModel() {
    this.showBasicDetailsScreen = true;
    this.userService
      .getUser(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showBasicDetailsScreen = false;
        })
      )
      .subscribe((response: UserBasicDetails) => {
        this.userBasicDetailsModel = response;
      });
    this.showEditDetailsModel = true;
  }

  editDetails(editDetailsForm: any) {
    this.isBasicDetails = true;
    this.userBasicDetailsRequest.email = this.currentUser;
    this.userBasicDetailsRequest.firstName =
      editDetailsForm.value.modalFirstName;
    this.userBasicDetailsRequest.lastName = editDetailsForm.value.modalLastName;
    this.userBasicDetailsRequest.phoneNumber =
      editDetailsForm.value.modalPhoneNumber;
    this.userBasicDetailsRequest.dateOfBirth =
      editDetailsForm.value.modalDateOfBirth;
    this.userBasicDetailsRequest.currentLocation =
      editDetailsForm.value.modalCurrentLocation;
    this.userBasicDetailsRequest.currentExperience =
      editDetailsForm.value.modalCurrentExperience;

    this.userService
      .updateUser(this.userBasicDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isBasicDetails = false;
        })
      )
      .subscribe((response: UserBasicDetails) => {
        this.ngOnInit();
        this.notificationService.info("Basic details saved successfully.");
      });
  }

  onSelectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(this.selectedFile);

      const uploadData = new FormData();
      uploadData.append("image", this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };

      this.userService
        .saveImage(uploadData, this.currentUser)
        .pipe(
          catchError(this.handleError),
          finalize(() => {})
        )
        .subscribe((response) => {
          this.ngOnInit();
        });
    }
  }

  onUploadResume(event: any) {
    this.uploadedResume = event.target.files[0];

    if (this.uploadedResume) {
      if (
        this.uploadedResume.type == "application/msword" ||
        this.uploadedResume.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        this.uploadedResume.type == "application/pdf"
      ) {
        this.isResume = true;
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
              this.isResume = false;
            })
          )
          .subscribe((response) => {
            this.ngOnInit();
            this.notificationService.info("Resume uploaded successfully.");
          });

        this.resumeName = null;
        this.showResumePdf = false;
        this.showResumeWord = false;

        if (
          this.uploadedResume.type == "application/msword" ||
          this.uploadedResume.type ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          this.showResumeWord = true;
          this.resumeName = this.uploadedResume.name;
        } else {
          this.showResumePdf = true;
          this.resumeName = this.uploadedResume.name;
        }
      } else {
        this.notificationService.error("Invalid resume format!");
      }
    }
  }

  deleteResume() {
    this.isDeleteResume = true;
    this.userService
      .deleteResume(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isDeleteResume = false;
        })
      )
      .subscribe((response) => {
        this.resumeProgress = 0;
        this.ngOnInit();
      });
    this.showResumePdf = false;
    this.showResumeWord = false;
    this.resumeName = null;
  }

  downloadResume() {
    this.isDownloadResume = true;
    this.userService
      .getResume(this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isDownloadResume = false;
        })
      )
      .subscribe((response: Resume) => {
        if (response.resume == null) {
          this.notificationService.error("You have uploaded a resume yet!");
        } else {
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
        }
      });
  }

  addEmployment(addEmploymentForm: any) {
    for (let emp of this.userSortedEmpResponse) {
      if (emp.currentJob && addEmploymentForm.value.empModelCurrentJob) {
        this.notificationService.error(
          "You are already serving notice period at " +
            "''" +
            emp.organization +
            "''"
        );
        return;
      }
    }
    this.isEmployment = true;
    this.userEmpDetailsRequest.email = this.currentUser;
    this.userEmpDetailsRequest.designation =
      addEmploymentForm.value.empModelDesignation;
    this.userEmpDetailsRequest.organization =
      addEmploymentForm.value.empModelOrganization;
    this.userEmpDetailsRequest.startMonth =
      addEmploymentForm.value.empModelStartMonth;
    this.userEmpDetailsRequest.startYear =
      addEmploymentForm.value.empModelStartYear;
    this.userEmpDetailsRequest.endMonth =
      addEmploymentForm.value.empModelEndMonth;
    this.userEmpDetailsRequest.endYear =
      addEmploymentForm.value.empModelEndYear;
    this.userEmpDetailsRequest.currentJob =
      addEmploymentForm.value.empModelCurrentJob;
    this.userEmpDetailsRequest.noticePeriod =
      addEmploymentForm.value.empModelNoticePeriod;
    this.userEmpDetailsRequest.jobRole =
      addEmploymentForm.value.empModelJobRole;

    this.employmentService
      .createEmployment(this.userEmpDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isEmployment = false;
          addEmploymentForm.reset();
        })
      )
      .subscribe((response) => {
        this.ngOnInit();
        this.notificationService.info("Employment added successfully.");
      });
  }

  openEditEmploymentModel(employment: any) {
    this.showEmploymentDetailsScreen = true;
    this.employmentService
      .getEmployment(this.currentUser, employment.id)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.showEmploymentDetailsScreen = false;
        })
      )
      .subscribe((response: Employment) => {
        this.userEmpDetailsModel = response;
        this.editEmploymentModelId = this.userEmpDetailsModel.id;
      });
    this.showEditEmploymentModel = true;
  }

  editEmployment(editEmploymentForm: any) {
    this.isEmployment = true;
    this.userEmpDetailsRequest.id = this.editEmploymentModelId;
    this.userEmpDetailsRequest.email = this.currentUser;
    this.userEmpDetailsRequest.designation =
      editEmploymentForm.value.empModelDesignation;
    this.userEmpDetailsRequest.organization =
      editEmploymentForm.value.empModelOrganization;
    this.userEmpDetailsRequest.startMonth =
      editEmploymentForm.value.empModelStartMonth;
    this.userEmpDetailsRequest.startYear =
      editEmploymentForm.value.empModelStartYear;
    this.userEmpDetailsRequest.currentJob =
      editEmploymentForm.value.empEditModelCurrentJob;
    if (!editEmploymentForm.value.empEditModelCurrentJob) {
      this.userEmpDetailsRequest.endMonth =
        editEmploymentForm.value.empModelEndMonth;
      this.userEmpDetailsRequest.endYear =
        editEmploymentForm.value.empModelEndYear;
      this.userEmpDetailsRequest.noticePeriod = "";
    } else {
      for (let emp of this.userSortedEmpResponse) {
        if (emp.currentJob && emp.id != this.editEmploymentModelId) {
          this.notificationService.error(
            "You are already serving notice period at " +
              "''" +
              emp.organization +
              "''"
          );
          this.isEmployment = false;
          return;
        }
      }
      this.userEmpDetailsRequest.endMonth = "";
      this.userEmpDetailsRequest.endYear = "";
      this.userEmpDetailsRequest.noticePeriod =
        editEmploymentForm.value.empModelNoticePeriod;
    }
    this.userEmpDetailsRequest.jobRole =
      editEmploymentForm.value.empModelJobRole;

    this.employmentService
      .editEmployment(this.userEmpDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isEmployment = false;
        })
      )
      .subscribe((response: Employment) => {
        this.employmentProgress = 0;
        this.ngOnInit();
        this.notificationService.info("Employment updated successfully.");
      });
  }

  deleteEmployment(employment: any) {
    this.isDeleteEmployment = true;
    this.employmentService
      .deleteEmployment(employment.id)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isDeleteEmployment = false;
        })
      )
      .subscribe((response) => {
        this.currentEmploymentProgress = 0;
        this.employmentProgress = 0;
        this.ngOnInit();
      });
  }

  addMasterEducation(masterEducationForm: any) {
    this.isMasterEducation = true;
    this.userMasterEduDetailsRequest.email = this.currentUser;
    this.userMasterEduDetailsRequest.education = "Masters/Post-Graduation";
    this.userMasterEduDetailsRequest.institute =
      masterEducationForm.value.masterInstitute;
    this.userMasterEduDetailsRequest.specialization =
      masterEducationForm.value.masterSpecialization;
    this.userMasterEduDetailsRequest.passingYear =
      masterEducationForm.value.masterPassYear;
    this.userMasterEduDetailsRequest.courseType =
      masterEducationForm.value.masterCourseType;

    this.educationService
      .saveMasters(this.userMasterEduDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isMasterEducation = false;
        })
      )
      .subscribe((response: Education) => {
        this.notificationService.info("Master education saved successfully.");
        this.ngOnInit();
      });
  }

  addBachelorEducation(bachelorEducationForm: any) {
    this.isBachelorEducation = true;
    this.userBachelorEduDetailsRequest.email = this.currentUser;
    this.userBachelorEduDetailsRequest.education = "Graduation/Diploma";
    this.userBachelorEduDetailsRequest.institute =
      bachelorEducationForm.value.bachelorInstitute;
    this.userBachelorEduDetailsRequest.specialization =
      bachelorEducationForm.value.bachelorSpecialization;
    this.userBachelorEduDetailsRequest.passingYear =
      bachelorEducationForm.value.bachelorPassYear;
    this.userBachelorEduDetailsRequest.courseType =
      bachelorEducationForm.value.bachelorCourseType;

    this.educationService
      .saveBachelors(this.userBachelorEduDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isBachelorEducation = false;
        })
      )
      .subscribe((response: Education) => {
        this.notificationService.info("Bachelor education saved successfully.");
        this.ngOnInit();
      });
  }

  addSeniorSecondaryEducation(seniorSecondaryEducationForm: any) {
    this.isSeniorSecEducation = true;
    this.userIntermediateEduDetailsRequest.email = this.currentUser;
    this.userIntermediateEduDetailsRequest.education =
      "12th Standard/Intermediate";
    this.userIntermediateEduDetailsRequest.board =
      seniorSecondaryEducationForm.value.seniorSecondaryBoard;
    this.userIntermediateEduDetailsRequest.percentage =
      seniorSecondaryEducationForm.value.seniorSecondaryPercentage;
    this.userIntermediateEduDetailsRequest.stream =
      seniorSecondaryEducationForm.value.seniorSecondaryStream;
    this.userIntermediateEduDetailsRequest.passingYear =
      seniorSecondaryEducationForm.value.seniorSecondaryPassYear;

    this.educationService
      .saveIntermediate(this.userIntermediateEduDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSeniorSecEducation = false;
        })
      )
      .subscribe((response: Education) => {
        this.notificationService.info(
          "Intermediate education saved successfully."
        );
        this.ngOnInit();
      });
  }

  addSecondaryEducation(secondaryEducationForm: any) {
    this.isSecondaryEducation = true;
    this.userSecondaryEduDetailsRequest.email = this.currentUser;
    this.userSecondaryEduDetailsRequest.education = "10th Standard/Secondary";
    this.userSecondaryEduDetailsRequest.board =
      secondaryEducationForm.value.secondaryBoard;
    this.userSecondaryEduDetailsRequest.percentage =
      secondaryEducationForm.value.secondaryPercentage;
    this.userSecondaryEduDetailsRequest.passingYear =
      secondaryEducationForm.value.secondaryPassYear;

    this.educationService
      .saveSecondary(this.userSecondaryEduDetailsRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSecondaryEducation = false;
        })
      )
      .subscribe((response: Education) => {
        this.notificationService.info(
          "Secondary education saved successfully."
        );
        this.ngOnInit();
      });
  }

  addPersonalDetails(personalDetailsForm: any) {
    this.isPersonal = true;
    this.userPersonalDetailRequest.email = this.currentUser;
    this.userPersonalDetailRequest.gender =
      personalDetailsForm.value.userGender;
    this.userPersonalDetailRequest.maritalStatus =
      personalDetailsForm.value.userMaritalStatus;
    this.userPersonalDetailRequest.hometown =
      personalDetailsForm.value.userHometown;
    this.userPersonalDetailRequest.pinCode =
      personalDetailsForm.value.userPinCode;

    this.userService
      .savePersonal(this.userPersonalDetailRequest)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isPersonal = false;
        })
      )
      .subscribe((response: Personal) => {
        this.notificationService.info("Personal details saved successfully.");
        this.ngOnInit();
      });
  }

  addSecondarySkills(skillForm: any) {
    if (
      skillForm.value.secondarySkillShown != "" &&
      !this.userSecondarySkillSet.includes(skillForm.value.secondarySkillShown)
    ) {
      this.userSecondarySkillSet.push(skillForm.value.secondarySkillShown);
    }
    this.secondarySkillShown = "";
  }

  removeSecondarySkills(secondarySkill: any) {
    let index = this.userSecondarySkillSet.indexOf(secondarySkill);
    this.userSecondarySkillSet.splice(index, 1);
  }

  saveSkills(skillForm: any) {
    this.isSkills = true;
    let primarySkill = new Skill();
    primarySkill.skillName = skillForm.value.userPrimarySkill;
    primarySkill.skillType = "Primary";
    this.userSkillsRequest.push(primarySkill);

    for (let skill of this.userSecondarySkillSet) {
      let secondarySkill = new Skill();
      secondarySkill.skillName = skill;
      secondarySkill.skillType = "Secondary";
      this.userSkillsRequest.push(secondarySkill);
    }
    this.userService
      .saveSkills(this.userSkillsRequest, this.currentUser)
      .pipe(
        catchError(this.handleError),
        finalize(() => {
          this.isSkills = false;
        })
      )
      .subscribe((response: Personal) => {
        this.userSkillsRequest = [];
        this.notificationService.info("Skills saved successfully.");
        this.ngOnInit();
      });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { ForgotPasswordRequest } from "../model/forgot-password-request.model";
import { Injectable } from "@angular/core";
import { ResetPasswordRequest } from "../model/reset-password-request.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.baseUrl;
  tokenSecretKey = environment.token_secret_key;

  constructor(private http: HttpClient) {}

  createUser(userRequest: any) {
    const headers = {
      "Content-type": "application/json",
    };
    return this.http.post(
      this.baseUrl + "/user/create",
      JSON.stringify(userRequest),
      { headers }
    );
  }

  saveImage(uploadData: FormData, email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.post(this.baseUrl + "/user/image/upload", uploadData, {
      params,
    });
  }

  saveResume(uploadResumeData: FormData, email: string, resumeName: string) {
    const params = new HttpParams()
      .set("email", email)
      .set("resumeName", resumeName);
    return this.http.post(
      this.baseUrl + "/user/resume/upload",
      uploadResumeData,
      { params }
    );
  }

  changeEmail(changeEmailRequest: any) {
    return this.http.post(
      this.baseUrl + "/user/email/update",
      JSON.stringify(changeEmailRequest),
      {}
    );
  }

  changePassword(changePasswordRequest: any) {
    return this.http.post(
      this.baseUrl + "/user/password/update",
      JSON.stringify(changePasswordRequest),
      {}
    );
  }

  forgotPassword(forgotPasswordRequest: ForgotPasswordRequest) {
    const headers = {
      "Content-type": "application/json",
    };
    return this.http.post(
      this.baseUrl + "/user/password/forgot",
      JSON.stringify(forgotPasswordRequest),
      { headers }
    );
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest) {
    const headers = {
      "Content-type": "application/json",
    };
    return this.http.post(
      this.baseUrl + "/user/password/reset",
      JSON.stringify(resetPasswordRequest),
      { headers }
    );
  }

  verifyUser(resetToken: string) {
    const params = new HttpParams().set("resetToken", resetToken);
    return this.http.post(this.baseUrl + "/user/verify", params);
  }

  findUser(email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.post(this.baseUrl + "/user/find", params);
  }

  savePersonal(personalDetailRequest: any) {
    return this.http.post(
      this.baseUrl + "/user/personal/save",
      JSON.stringify(personalDetailRequest),
      {}
    );
  }

  saveSkills(userSkillsRequest: any, userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.post(
      this.baseUrl + "/user/skills/save",
      JSON.stringify(userSkillsRequest),
      {
        params,
      }
    );
  }

  sendQuery(contactUsRequest: any) {
    const headers = {
      "Content-type": "application/json",
    };
    return this.http.post(
      this.baseUrl + "/user/query",
      JSON.stringify(contactUsRequest),
      { headers }
    );
  }

  generateConfirmationCode(email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.post(this.baseUrl + "/user/code/generate", {}, { params });
  }

  verifyEmail(email: string, confirmationCode: string) {
    const params = new HttpParams()
      .set("email", email)
      .set("value", confirmationCode);
    return this.http.post(this.baseUrl + "/user/mail/verify", {}, { params });
  }

  updateUser(userProfileRequest: any) {
    return this.http.put(
      this.baseUrl + "/user/update",
      JSON.stringify(userProfileRequest),
      {}
    );
  }

  getJobCount() {
    return this.http.get(this.baseUrl + "/user/job/count/get", {});
  }

  getName(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/user/name/get", {
      params,
    });
  }

  getUser(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/user/get", {
      params,
    });
  }

  getResume(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/user/resume/get", {
      params,
    });
  }

  getDashboard(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/user/dashboard/get", {
      params,
    });
  }

  deleteResume(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.delete(this.baseUrl + "/user/resume/delete", {
      params,
    });
  }
}

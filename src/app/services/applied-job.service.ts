import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AppliedJobService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createApplication(email: string, jobId: string) {
    const params = new HttpParams().set("email", email).set("jobId", jobId);
    return this.http.post(this.baseUrl + "/application/create", {}, { params });
  }

  updateApplication(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.put(this.baseUrl + "/application/update", {}, { params });
  }

  updateJobStatus(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.put(
      this.baseUrl + "/application/job/status/update",
      {},
      { params }
    );
  }

  changeOneApplicationStatus(jobId: string, applicationId: string) {
    const params = new HttpParams()
      .set("jobId", jobId)
      .set("applicationId", applicationId);
    return this.http.put(
      this.baseUrl + "/application/status/update",
      {},
      { params }
    );
  }

  changeAllApplicationStatus(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.put(
      this.baseUrl + "/application/status/updateAll",
      {},
      { params }
    );
  }

  getRespond(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.get(this.baseUrl + "/application/get", {
      params,
    });
  }

  alreadyApplied(email: string, jobId: string) {
    const params = new HttpParams().set("email", email).set("jobId", jobId);
    return this.http.get(this.baseUrl + "/application/applied", {
      params,
    });
  }

  validate(email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.get(this.baseUrl + "/application/validate", {
      params,
    });
  }

  checkStatus(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.get(this.baseUrl + "/application/status/checkAll", {
      params,
    });
  }

  getAllApplied(email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.get(this.baseUrl + "/application/submit/getAll", {
      params,
    });
  }

  getAllRespond(email: string) {
    const params = new HttpParams().set("email", email);
    return this.http.get(this.baseUrl + "/application/response/getAll", {
      params,
    });
  }

  downloadResume(userEmail: string, jobId: string) {
    const params = new HttpParams().set("email", userEmail).set("jobId", jobId);
    return this.http.get(this.baseUrl + "/application/resume/get", {
      params,
    });
  }

  downloadCandidateResume(applicationId: string) {
    const params = new HttpParams().set("applicationId", applicationId);
    return this.http.get(this.baseUrl + "/application/response/resume/get", {
      params,
    });
  }

  downloadAllCandidateResume(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.get(this.baseUrl + "/application/response/resume/getAll", {
      params,
    });
  }

  withdrawApplication(userEmail: string, jobId: string) {
    const params = new HttpParams().set("email", userEmail).set("jobId", jobId);
    return this.http.delete(this.baseUrl + "/application/delete", {
      params,
    });
  }
}

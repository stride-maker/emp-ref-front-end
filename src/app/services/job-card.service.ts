import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class JobCardService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllSkillJobs(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/job/card/portal/getAll", {
      params,
    });
  }

  getAllReferredJobs(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/job/card/referrer/getAll", {
      params,
    });
  }

  editStatus(jobId: string, jobStatus: string) {
    const params = new HttpParams()
      .set("jobId", jobId)
      .set("jobStatus", jobStatus);
    return this.http.put(
      this.baseUrl + "/job/card/status/update",
      {},
      {
        params,
      }
    );
  }

  deleteJob(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.delete(this.baseUrl + "/job/card/delete", {
      params,
    });
  }
}

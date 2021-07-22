import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class JobParentService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createJob(jobParentRequest: any) {
    return this.http.post(
      this.baseUrl + "/job/create",
      JSON.stringify(jobParentRequest),
      {}
    );
  }

  updateJob(editJobParentRequest: any) {
    return this.http.put(
      this.baseUrl + "/job/update",
      JSON.stringify(editJobParentRequest),
      {}
    );
  }

  getJob(jobId: string) {
    const params = new HttpParams().set("jobId", jobId);
    return this.http.get(this.baseUrl + "/job/get", {
      params,
    });
  }
}

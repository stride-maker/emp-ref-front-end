import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmploymentService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createEmployment(employmentRequest: any) {
    return this.http.post(
      this.baseUrl + "/employment/create",
      JSON.stringify(employmentRequest),
      {}
    );
  }

  getEmployment(userEmail: string, userEmpId: string) {
    const params = new HttpParams()
      .set("email", userEmail)
      .set("empId", userEmpId);
    return this.http.get(this.baseUrl + "/employment/get", {
      params,
    });
  }

  editEmployment(employmentRequest: any) {
    return this.http.put(
      this.baseUrl + "/employment/update",
      JSON.stringify(employmentRequest),
      {}
    );
  }

  deleteEmployment(userEmpId: string) {
    const params = new HttpParams().set("empId", userEmpId);
    return this.http.delete(this.baseUrl + "/employment/delete", {
      params,
    });
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EducationService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  saveMasters(educationRequest: any) {
    return this.http.post(
      this.baseUrl + "/education/master/create",
      JSON.stringify(educationRequest),
      {}
    );
  }

  saveBachelors(educationRequest: any) {
    return this.http.post(
      this.baseUrl + "/education/bachelor/create",
      JSON.stringify(educationRequest),
      {}
    );
  }

  saveIntermediate(educationRequest: any) {
    return this.http.post(
      this.baseUrl + "/education/intermediate/create",
      JSON.stringify(educationRequest),
      {}
    );
  }

  saveSecondary(educationRequest: any) {
    return this.http.post(
      this.baseUrl + "/education/secondary/create",
      JSON.stringify(educationRequest),
      {}
    );
  }
}

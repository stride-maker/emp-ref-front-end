import { HttpClient, HttpParams } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserSkillService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllSkillsByUserId(userEmail: string) {
    const params = new HttpParams().set("email", userEmail);
    return this.http.get(this.baseUrl + "/skills/user/getAll", {
      params,
    });
  }
}

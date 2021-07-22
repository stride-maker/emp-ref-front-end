import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { Helper } from "../helper/footsteps-helper";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-fail-reset-password",
  templateUrl: "./fail-reset-password.component.html",
  styleUrls: ["./fail-reset-password.component.css"],
})
export class FailResetPasswordComponent implements OnInit {
  resetToken: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resetToken = params["resetToken"];
    });
  }

  ngOnInit() {
    this.userService.verifyUser(this.resetToken).subscribe((response) => {
      if (response.toString() == "true") {
        localStorage.setItem("resetPassToken", this.resetToken);
        Helper.isNextStep = true;
        this.router.navigate(["/reset-password"]);
      }
    });
  }
}

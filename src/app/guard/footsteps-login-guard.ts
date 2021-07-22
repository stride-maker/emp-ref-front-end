import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import { Injectable } from "@angular/core";
import { LoginService } from "../services/login.service";

@Injectable()
export class FootstepsLoginGuard implements CanActivate {
  navRoutes: string[] = [
    "/",
    "/login",
    "/logout",
    "/expired-logout",
    "/register",
    "/home",
    "/about-us",
    "/job-seeker",
    "/job-referrer",
    "/contact-us",
    "/privacy-policy",
    "/terms-and-conditions",
    "/fail-reset-password",
  ];

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.loginService.currentUserValue;
    if (currentUser) {
      if (this.navRoutes.includes(state.url))
        this.router.navigate(["/dashboard"]);
      return true;
    }
    if (this.navRoutes.includes(state.url)) {
      return true;
    }
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
      queryParamsHandling: "merge",
    });
    return false;
  }
}

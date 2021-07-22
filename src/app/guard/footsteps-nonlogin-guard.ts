import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import { Helper } from "../helper/footsteps-helper";
import { Injectable } from "@angular/core";

@Injectable()
export class FootstepsNonLoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!Helper.isNextStep) {
      this.router.navigate(["/unauthorized-access"]);
      return false;
    } else {
      return Helper.isNextStep;
    }
  }
}

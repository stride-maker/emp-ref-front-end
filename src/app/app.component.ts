import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import { Component } from "@angular/core";
import { Helper } from "./helper/footsteps-helper";
import { LocationStrategy } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { filter } from "rxjs/internal/operators/filter";
import { map } from "rxjs/internal/operators/map";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private location: LocationStrategy,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    location.onPopState(() => {
      Helper.isNextStep = false;
    });
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }

  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child.snapshot.data["title"]) {
            return child.snapshot.data["title"];
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }
}

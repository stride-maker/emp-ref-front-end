import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"],
})
export class LogoutComponent implements OnInit {
  showLoadingScreen = true;
  constructor() {}

  ngOnInit() {
    setTimeout(() => (this.showLoadingScreen = false), 2000);
  }
}

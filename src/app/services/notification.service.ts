import { NavigationStart, Router } from "@angular/router";

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Notification, NotificationType } from "../model/notification.model";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  public keepAfterRouteChange = true;

  public subject = new Subject<Notification>();
  constructor(public router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  success(message: string, keepAfterRouteChange = false) {
    this.showNotification(
      NotificationType.Success,
      message,
      keepAfterRouteChange
    );
  }

  error(message: string, keepAfterRouteChange = false) {
    this.showNotification(
      NotificationType.Error,
      message,
      keepAfterRouteChange
    );
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.showNotification(
      NotificationType.Warning,
      message,
      keepAfterRouteChange
    );
  }

  info(message: string, keepAfterRouteChange = false) {
    this.showNotification(NotificationType.Info, message, keepAfterRouteChange);
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  private showNotification(
    type: NotificationType,
    message: string,
    keepAfterRouteChange = false
  ) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Notification>{ type: type, message: message });
  }

  private clear() {
    this.subject.next();
  }
}

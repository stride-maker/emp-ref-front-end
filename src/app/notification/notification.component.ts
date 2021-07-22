import { Component, OnInit } from "@angular/core";
import { Notification, NotificationType } from "../model/notification.model";

import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getAlert().subscribe((alert: Notification) => {
      this.notifications = [];
      if (!alert) {
        this.notifications = [];
        return;
      }
      this.notifications.push(alert);
      setTimeout(() => {
        this.notifications = this.notifications.filter((x) => x !== alert);
      }, 5000);
    });
  }

  removeNotification(notification: Notification) {
    this.notifications = this.notifications.filter((x) => x !== notification);
  }

  cssClass(notification: Notification) {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case NotificationType.Success:
        return "toast-success";
      case NotificationType.Error:
        return "toast-error";
      case NotificationType.Info:
        return "toast-info";
      case NotificationType.Warning:
        return "toast-warning";
    }
  }
}

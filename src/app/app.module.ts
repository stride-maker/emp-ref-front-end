import {
  AuthService,
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from "angular-6-social-login";
import { BrowserModule, Title } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AboutUsComponent } from "./about-us/about-us.component";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CandidateDetailsComponent } from "./candidate-details/candidate-details.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DatePipe } from "@angular/common";
import { ExpiredLogoutComponent } from "./expired-logout/expired-logout.component";
import { FailResetPasswordComponent } from "./fail-reset-password/fail-reset-password.component";
import { FooterComponent } from "./footer/footer.component";
import { FootstepsErrorHandler } from "./error/footsteps-error-handler";
import { FootstepsInterceptor } from "./interceptor/footsteps-interceptor";
import { FootstepsLoginGuard } from "./guard/footsteps-login-guard";
import { FootstepsNonLoginGuard } from "./guard/footsteps-nonlogin-guard";
import { FormatTimePipe } from "./pipes/format-time.pipe";
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./home/home.component";
import { InsideFooterComponent } from "./inside-footer/inside-footer.component";
import { InsideHeaderComponent } from "./inside-header/inside-header.component";
import { JobApplyComponent } from "./job-apply/job-apply.component";
import { JobPortalComponent } from "./job-portal/job-portal.component";
import { JobReferrerComponent } from "./job-referrer/job-referrer.component";
import { JobSeekerComponent } from "./job-seeker/job-seeker.component";
import { JobSpinnerComponent } from "./job-spinner/job-spinner.component";
import { LearnMoreComponent } from "./learn-more/learn-more.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./services/login.service";
import { LogoutComponent } from "./logout/logout.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NotificationComponent } from "./notification/notification.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReferrerPaginationComponent } from "./referrer-pagination/referrer-pagination.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { RestrictedComponent } from "./restricted/restricted.component";
import { SeekerPaginationComponent } from "./seeker-pagination/seeker-pagination.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { UserReferrerComponent } from "./user-referrer/user-referrer.component";
import { UserResponderComponent } from "./user-responder/user-responder.component";
import { UserSeekerComponent } from "./user-seeker/user-seeker.component";
import { UserService } from "./services/user.service";
import { ViewJobComponent } from "./view-job/view-job.component";

export function socialConfigs() {
  const config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("1031241503961006"),
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "876417446987-drg7mq32gd41n409ugaph8v12481e7uu.apps.googleusercontent.com"
      ),
    },
  ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    FooterComponent,
    AboutUsComponent,
    JobSeekerComponent,
    JobReferrerComponent,
    ResetPasswordComponent,
    FailResetPasswordComponent,
    DashboardComponent,
    NotificationComponent,
    RestrictedComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    ProfileComponent,
    ContactUsComponent,
    InsideHeaderComponent,
    InsideFooterComponent,
    ExpiredLogoutComponent,
    JobPortalComponent,
    UserSeekerComponent,
    UserReferrerComponent,
    UserResponderComponent,
    NotFoundComponent,
    LoadingSpinnerComponent,
    JobApplyComponent,
    ViewJobComponent,
    FormatTimePipe,
    SeekerPaginationComponent,
    ReferrerPaginationComponent,
    JobSpinnerComponent,
    LearnMoreComponent,
    CandidateDetailsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  providers: [
    Title,
    DatePipe,
    FootstepsLoginGuard,
    FootstepsNonLoginGuard,
    LoginService,
    UserService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: FootstepsInterceptor, multi: true },
    { provide: ErrorHandler, useClass: FootstepsErrorHandler },
    { provide: AuthServiceConfig, useFactory: socialConfigs },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

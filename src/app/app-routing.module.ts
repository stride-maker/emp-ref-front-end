import { RouterModule, Routes } from "@angular/router";

import { AboutUsComponent } from "./about-us/about-us.component";
import { CandidateDetailsComponent } from "./candidate-details/candidate-details.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ExpiredLogoutComponent } from "./expired-logout/expired-logout.component";
import { FailResetPasswordComponent } from "./fail-reset-password/fail-reset-password.component";
import { FootstepsLoginGuard } from "./guard/footsteps-login-guard";
import { FootstepsNonLoginGuard } from "./guard/footsteps-nonlogin-guard";
import { HomeComponent } from "src/app/home/home.component";
import { JobApplyComponent } from "./job-apply/job-apply.component";
import { JobPortalComponent } from "./job-portal/job-portal.component";
import { JobReferrerComponent } from "./job-referrer/job-referrer.component";
import { JobSeekerComponent } from "./job-seeker/job-seeker.component";
import { LearnMoreComponent } from "./learn-more/learn-more.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { NgModule } from "@angular/core";
import { NotFoundComponent } from "./not-found/not-found.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { RestrictedComponent } from "./restricted/restricted.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { UserReferrerComponent } from "./user-referrer/user-referrer.component";
import { UserResponderComponent } from "./user-responder/user-responder.component";
import { UserSeekerComponent } from "./user-seeker/user-seeker.component";
import { ViewJobComponent } from "./view-job/view-job.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [FootstepsLoginGuard],
    component: HomeComponent,
    data: { title: "Footsteps | referrals.. refer and earn" },
  },
  {
    path: "fail-reset-password",
    component: FailResetPasswordComponent,
    data: { title: "Link Expired | referrals.. refer and earn" },
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Sign In | referrals.. refer and earn" },
  },
  {
    path: "logout",
    canActivate: [FootstepsLoginGuard],
    component: LogoutComponent,
    data: { title: "Log Out | referrals.. refer and earn" },
  },
  {
    path: "expired-logout",
    canActivate: [FootstepsLoginGuard],
    component: ExpiredLogoutComponent,
    data: { title: "Session Expired | referrals.. refer and earn" },
  },
  {
    path: "unauthorized-access",
    component: RestrictedComponent,
    data: { title: "Not Authorized | referrals.. refer and earn" },
  },
  {
    path: "reset-password",
    canActivate: [FootstepsNonLoginGuard],
    component: ResetPasswordComponent,
    data: { title: "Password Reset | referrals.. refer and earn" },
  },
  {
    path: "home",
    canActivate: [FootstepsLoginGuard],
    component: HomeComponent,
    data: { title: "Home | referrals.. refer and earn" },
  },
  {
    path: "about-us",
    canActivate: [FootstepsLoginGuard],
    component: AboutUsComponent,
    data: { title: "About Us | referrals.. refer and earn" },
  },
  {
    path: "job-seeker",
    canActivate: [FootstepsLoginGuard],
    component: JobSeekerComponent,
    data: { title: "Job Seeker | referrals.. refer and earn" },
  },
  {
    path: "job-referrer",
    canActivate: [FootstepsLoginGuard],
    component: JobReferrerComponent,
    data: { title: "Job Referrer | referrals.. refer and earn" },
  },
  {
    path: "contact-us",
    canActivate: [FootstepsLoginGuard],
    component: ContactUsComponent,
    data: { title: "Contact Us | referrals.. refer and earn" },
  },
  {
    path: "privacy-policy",
    canActivate: [FootstepsLoginGuard],
    component: PrivacyPolicyComponent,
    data: { title: "Privacy Policy | referrals.. refer and earn" },
  },
  {
    path: "terms-and-conditions",
    canActivate: [FootstepsLoginGuard],
    component: TermsAndConditionsComponent,
    data: { title: "Terms & Conditions | referrals.. refer and earn" },
  },
  {
    path: "register",
    canActivate: [FootstepsLoginGuard],
    component: RegisterComponent,
    data: { title: "Sign Up | referrals.. refer and earn" },
  },

  {
    path: "dashboard",
    canActivate: [FootstepsLoginGuard],
    component: DashboardComponent,
    data: { title: "Dashboard | referrals.. refer and earn" },
  },
  {
    path: "profile",
    canActivate: [FootstepsLoginGuard],
    component: ProfileComponent,
    data: { title: "Profile | referrals.. refer and earn" },
  },
  {
    path: "job-portal",
    canActivate: [FootstepsLoginGuard],
    component: JobPortalComponent,
    data: { title: "Job Portal | referrals.. refer and earn" },
  },
  {
    path: "user-seeker",
    canActivate: [FootstepsLoginGuard],
    component: UserSeekerComponent,
    data: { title: "Apply Jobs | referrals.. refer and earn" },
  },
  {
    path: "user-referrer",
    canActivate: [FootstepsLoginGuard],
    component: UserReferrerComponent,
    data: { title: "Refer Jobs | referrals.. refer and earn" },
  },
  {
    path: "user-responder",
    canActivate: [FootstepsLoginGuard],
    component: UserResponderComponent,
    data: { title: "Jobs For Response | referrals.. refer and earn" },
  },
  {
    path: "apply-job",
    canActivate: [FootstepsLoginGuard],
    component: JobApplyComponent,
    data: { title: "Submit Application | referrals.. refer and earn" },
  },
  {
    path: "view-job",
    canActivate: [FootstepsLoginGuard],
    component: ViewJobComponent,
    data: { title: "Job Details | referrals.. refer and earn" },
  },
  {
    path: "learn-more",
    canActivate: [FootstepsLoginGuard],
    component: LearnMoreComponent,
    data: { title: "Learn More | referrals.. refer and earn" },
  },
  {
    path: "candidate-details",
    canActivate: [FootstepsLoginGuard],
    component: CandidateDetailsComponent,
    data: { title: "Candidates | referrals.. refer and earn" },
  },
  {
    path: "**",
    component: NotFoundComponent,
    data: { title: "404 Not Found | referrals.. refer and earn" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

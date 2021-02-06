import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
} from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { AppContainerComponent } from "./components/app-container/app-container.component";
import { UserService } from "./services/user-service";

import { SecurityService } from "./services/security/security.component";
import { SpinnerService } from "./services/spinner-service";

const googleLogoURL =
  "assets/Google.svg";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  constructor(private route: ActivatedRoute, private securityService: SecurityService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, private httpClinet: HttpClient, public userService: UserService, private router: Router, public spinnerService: SpinnerService) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
  }

  breadcrumb: String;
  selectedPage: string = "";
  @ViewChild("container")
  container: AppContainerComponent;

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      if (!this.securityService.isUserLoggedIn() && params.get("code") != null) {
        this.spinnerService.stopSpinner()
        this.securityService.getAccessToken(params.get("state"), params.get("code"), params.get("scope"));
      }
    })

    if (this.securityService.isUserLoggedIn()) {
      this.userService.getUserInfo().finally(() => {
        this.userService.getConsumedFoodInfo().finally(() => {
          this.pageToOpenAfterLogin();
          this.spinnerService.stopSpinner();
        });
      });
    }

    this.securityService.userLoginEvent.subscribe((ev: string) => {
      if ("userLoggedIn" == ev) {
        this.spinnerService.stopSpinner();
        this.router.navigate([`/`], { relativeTo: this.route });
        this.pageToOpenAfterLogin();
      } else {
        this.container.setParent(null);
        this.container.setChild(null);
        this.breadcrumb = "";
        this.container.closeDrawer();
      }
    });

  }

  pageToOpenAfterLogin() {
    if (this.userService.userInfo.calloriesGoal && this.userService.userInfo.calloriesGoal > 0) {
      this.openTrackFoodPage();
    } else {
      this.openUserPage();
    }
  }

  isUserLoggedIn(): boolean {
    return this.securityService.isUserLoggedIn();
  }

  setBreadcrumb(event: any) {
    this.breadcrumb = event;
  }

  getPictureUrl(): string {
    return this.userService.userInfo.pictureUrl;
  }

  getIdpAuthorizationCodeRequestUrl(): string {
    return this.securityService.requestAuthorizationCode();
  }

  openUserPage() {
    this.container.setParent('User Settings');
  }

  openTrackFoodPage() {
    this.container.setParent('Track food');
  }

  logOut() {
    this.securityService.logOut();
  }

  toggleDrawer() {
    this.container.toggleDrawer();
  }

}
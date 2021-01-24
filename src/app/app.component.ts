import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
} from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { AppContainerComponent } from "./app-container/app-container.component";
import { UserService } from "./services/user-service/user-service";
import { UserInfo } from "./model/user-info";

import { SecurityService } from "./services/security/security.component";

const googleLogoURL =
  "assets/Google.svg";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  constructor(private route: ActivatedRoute, private securityService: SecurityService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, private httpClinet: HttpClient, private userService: UserService) {
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

        this.securityService.getAccessToken(params.get("state"), params.get("code"), params.get("scope"));
      }
    })

    if (this.securityService.isUserLoggedIn()) {
      this.userService.getUserInfo();
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
    this.container.setParent('User');
  }

  logOut() {
    this.securityService.logOut();
  }

  toggleDrawer() {
    this.container.toggleDrawer();
  }
}
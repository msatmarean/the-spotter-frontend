
import { Component, Input, OnInit } from "@angular/core";
import { UserUpdateRequest } from "../model/user-update-request";
import { SecurityService } from "../services/security/security.component";
import { UserService } from "../services/user-service";


@Component({
  selector: "user-component",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, private securityService: SecurityService) { }
  macros: UserUpdateRequest = new UserUpdateRequest();;
  isLoadingResults: boolean = false;
  ngOnInit(): void {
    this.isLoadingResults = true;
    this.userService.getUserInfo().finally(() => {

      this.macros.carbsGoal = this.userService.userInfo.carbsGoal;
      this.macros.proteinsGoal = this.userService.userInfo.proteinsGoal;
      this.macros.fatsGoal = this.userService.userInfo.fatsGoal;
      this.macros.calloriesGoal = this.userService.userInfo.calloriesGoal;

      this.isLoadingResults = false;
    }).catch((ex: any) => {
      this.securityService.logOut();
    });
  }

  save() {
    this.userService.saveMacros(this.macros);
  }

  calculateCalories() {
    this.macros.calloriesGoal = this.userService.calculateCalories(this.macros.carbsGoal, this.macros.proteinsGoal, this.macros.fatsGoal);
  }

  getPictureUrl(): string {
    return this.userService.userInfo.pictureUrl;
  }

  getUserName(): string {
    return this.userService.userInfo.name;
  }
}


import { Component, Input, OnInit } from "@angular/core";
import { UserInfo } from "../model/user-info";
import { UserUpdateRequest } from "../model/user-update-request";
import { UserService } from "../services/user-service/user-service";


@Component({
  selector: "user-component",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService) { }
  macros: UserUpdateRequest = new UserUpdateRequest();;

  ngOnInit(): void {
    this.userService.getUserInfo().finally(() => {

      this.macros.carbsGoal = this.userService.userInfo.carbsGoal;
      this.macros.proteinsGoal = this.userService.userInfo.proteinsGoal;
      this.macros.fatsGoal = this.userService.userInfo.fatsGoal;
      this.macros.calloriesGoal = this.userService.userInfo.calloriesGoal;
    });
  }

  save() {
    this.userService.saveMacros(this.macros);
  }

  calculateCalories() {
    this.macros.calloriesGoal = this.userService.calculateCalories(this.macros.carbsGoal, this.macros.proteinsGoal, this.macros.fatsGoal);
  }

}

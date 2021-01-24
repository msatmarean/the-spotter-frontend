import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserInfo } from "src/app/model/user-info";
import { UserUpdateRequest } from "src/app/model/user-update-request";
import { SecurityService } from "../security/security.component";

@Injectable({
    providedIn: "root"
})
export class UserService {

    constructor(private httpClient: HttpClient) { }

    userInfo: UserInfo = new UserInfo();

    getUserInfo(): Promise<any> {
        return this.httpClient.get<UserInfo>("http://localhost:8080/backend/user/info").toPromise().then((response: UserInfo) => {
            this.userInfo = response;
            this.userInfo.calloriesGoal = this.calculateCalories(response.carbsGoal, response.proteinsGoal, response.fatsGoal);
        });
    }

    setUserInfo(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    isUserDataLoaded(): boolean {
        return (this.userInfo.name != null)
    }

    saveMacros(macros: UserUpdateRequest) {
        this.httpClient.put("http://localhost:8080/backend/user/info", macros).subscribe(() => {
            this.userInfo.calloriesGoal = macros.calloriesGoal;
            this.userInfo.carbsGoal = macros.carbsGoal;
            this.userInfo.proteinsGoal = macros.proteinsGoal;
            this.userInfo.fatsGoal = macros.fatsGoal;
        });
    }

    calculateCalories(carbs: number, proteins: number, fats: number): number {
        return (4 * carbs + 4 * proteins + 9 * fats);
    }
}
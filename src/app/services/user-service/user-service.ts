import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfo } from "src/app/model/user-info";
import { UserUpdateRequest } from "src/app/model/user-update-request";
import { ApiPaths } from "../api.paths";

@Injectable({
    providedIn: "root"
})
export class UserService {

    constructor(private httpClient: HttpClient, private apiPaths: ApiPaths) { }

    userInfo: UserInfo = new UserInfo();

    getUserInfo(): Promise<any> {
        return this.httpClient.get<UserInfo>(this.apiPaths.USER_INFO).toPromise().then((response: UserInfo) => {
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
        this.httpClient.put(this.apiPaths.USER_INFO, macros).subscribe(() => {
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
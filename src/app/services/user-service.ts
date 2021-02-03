import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfo } from "src/app/model/user-info";
import { UserUpdateRequest } from "src/app/model/user-update-request";
import { Belly } from "../model/belly";
import { ConsumedModel } from "../model/consumed-model";
import { ApiPaths } from "./api.paths";
import { SpinnerService } from "./spinner-service";

@Injectable({
    providedIn: "root"
})
export class UserService {

    constructor(private httpClient: HttpClient, private apiPaths: ApiPaths, private spinnerService: SpinnerService) { }

    userInfo: UserInfo = new UserInfo();
    consumedFood: ConsumedModel;
    eachConsumedFood: Belly[] = [];

    logOut() {
        this.consumedFood = undefined;
        this.userInfo = new UserInfo();
        this.eachConsumedFood = [];
    }

    getUserInfo(): Promise<any> {
        this.spinnerService.startSpinner();
        return this.httpClient.get<UserInfo>(this.apiPaths.USER_INFO).toPromise().then((response: UserInfo) => {
            this.userInfo = response;
            this.userInfo.calloriesGoal = this.calculateCalories(response.carbsGoal, response.proteinsGoal, response.fatsGoal);
            this.spinnerService.stopSpinner();
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

    getConsumedFoodInfo(): Promise<any> {
        this.spinnerService.startSpinner();
        return this.httpClient
            .get<any>(this.apiPaths.BELLY_CONSUMED_ON, {
                params: new HttpParams().append("date", new Date().getTime().toString())
            })
            .toPromise()
            .then((response: any) => {
                this.eachConsumedFood = response;
                this.consumedFood = new ConsumedModel;
                response.forEach((d: Belly) => {
                    this.consumedFood.calories = this.consumedFood.calories + d.food.calories * (d.qty / 100);
                    this.consumedFood.proteins = this.consumedFood.proteins + d.food.proteins * (d.qty / 100);
                    this.consumedFood.carbs = this.consumedFood.carbs + d.food.carbs * (d.qty / 100);
                    this.consumedFood.fats = this.consumedFood.fats + d.food.fats * (d.qty / 100);
                });
                this.roundCounters();
                this.spinnerService.stopSpinner();
            });
    }

    roundCounters() {
        this.consumedFood.calories = Math.round(this.consumedFood.calories * 100 + Number.EPSILON) / 100;
        this.consumedFood.proteins = Math.round(this.consumedFood.proteins * 100 + Number.EPSILON) / 100;
        this.consumedFood.carbs = Math.round(this.consumedFood.carbs * 100 + Number.EPSILON) / 100;
        this.consumedFood.fats = Math.round(this.consumedFood.fats * 100 + Number.EPSILON) / 100;
    }

    getEachConsumedFood(): Belly[] {
        return this.eachConsumedFood;
    }

    getConsumedFood(): ConsumedModel {
        return this.consumedFood ? this.consumedFood : new ConsumedModel();
    }

    getAvailableCallories(): string {
        return this.getRound(this.userInfo.calloriesGoal - this.getConsumedFood().calories);
    }

    getAvailableProteins(): string {
        return this.getRound(this.userInfo.proteinsGoal - this.getConsumedFood().proteins);
    }

    getAvailableCarbs(): string {
        return this.getRound(this.userInfo.carbsGoal - this.getConsumedFood().carbs);
    }

    getAvailableFats(): string {
        return this.getRound(this.userInfo.fatsGoal - this.getConsumedFood().fats);
    }

    getRound(num: number): string {
        return num.toFixed(2);
    }

}
import { HttpClient, HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiPaths } from "src/app/services/api.paths";
import { UserService } from "src/app/services/user-service/user-service";
import { Belly } from "../../model/belly";

@Component({
  selector: "app-consumed-food",
  templateUrl: "./consumed-food.component.html",
  styleUrls: ["./consumed-food.component.css"]
})
export class ConsumedFoodComponent implements AfterViewInit {
  displayedColumns: string[] = ["name", "descripiton", "qty", "action"];

  data: Belly[] = [];
  calories: number = 0;
  proteins: number = 0;
  carbs: number = 0;
  fats: number = 0;
  constructor(private httpClient: HttpClient, public userService: UserService, private apiPaths: ApiPaths) { }

  ngAfterViewInit() {
    this.search();
  }

  search() {
    this.resetCounters();
    this.httpClient
      .get<any>(this.apiPaths.BELLY_CONSUMED_ON, {
        params: new HttpParams().append("date", new Date().getTime().toString())
      })
      .toPromise()
      .then((response: any) => {
        this.data = response;
        this.data.forEach((d: Belly) => {
          this.calories = this.calories + d.food.calories * (d.qty / 100);
          this.proteins = this.proteins + d.food.proteins * (d.qty / 100);
          this.carbs = this.carbs + d.food.carbs * (d.qty / 100);
          this.fats = this.fats + d.food.fats * (d.qty / 100);
        });
        this.roundCounters();
      })
      .finally(() => { });
  }

  delete(id: number) {
    this.httpClient
      .get<any>(this.apiPaths.DELETE_BELLY, {
        params: new HttpParams().append("id", id.toString())
      })
      .toPromise()
      .then(() => {
        this.search();
      });
  }

  roundCounters() {
    this.calories = Math.round(this.calories * 100 + Number.EPSILON) / 100;
    this.proteins = Math.round(this.proteins * 100 + Number.EPSILON) / 100;
    this.carbs = Math.round(this.carbs * 100 + Number.EPSILON) / 100;
    this.fats = Math.round(this.fats * 100 + Number.EPSILON) / 100;
  }

  resetCounters() {
    this.calories = 0;
    this.proteins = 0;
    this.carbs = 0;
    this.fats = 0;
  }

  getAvailableCallories(): number {
    return this.userService.userInfo.calloriesGoal - this.calories;
  }

  getAvailableProteins(): number {
    return this.userService.userInfo.proteinsGoal - this.proteins;
  }

  getAvailableCarbs(): number {
    return this.userService.userInfo.carbsGoal - this.carbs;
  }

  getAvailableFats(): number {
    return this.userService.userInfo.fatsGoal - this.fats;
  }

}

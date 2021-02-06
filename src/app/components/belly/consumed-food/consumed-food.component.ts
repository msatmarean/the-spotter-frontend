import { HttpClient, HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiPaths } from "src/app/services/api.paths";
import { UserService } from "src/app/services/user-service";

@Component({
  selector: "app-consumed-food",
  templateUrl: "./consumed-food.component.html",
  styleUrls: ["./consumed-food.component.css"]
})
export class ConsumedFoodComponent implements AfterViewInit {
  displayedColumns: string[] = ["name", "calories", "qty", "action"];

  constructor(private httpClient: HttpClient, public userService: UserService, private apiPaths: ApiPaths) { }

  ngAfterViewInit() {

  }

  delete(id: number) {
    this.httpClient
      .get<any>(this.apiPaths.DELETE_BELLY, {
        params: new HttpParams().append("id", id.toString())
      })
      .toPromise()
      .then(() => {
        this.userService.getConsumedFoodInfo();
      });
  }

}

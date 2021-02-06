import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  OnInit
} from "@angular/core";
import { FoodCategory } from "../../model/food-category";
import { FoodDirectory } from "../../model/food-directory";
import { FoodDescription } from "../../model/food-description";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiPaths } from "../../services/api.paths";
import { ApplicationStateService } from "../../services/application-state.service";
import { CommonSearchComponent } from "../common-search.component";
import { SpinnerService } from "../../services/spinner-service";
import { UserService } from "src/app/services/user-service";
@Component({
  selector: "app-food-directory",
  templateUrl: "./food-directory.component.html",
  styleUrls: ["./food-directory.component.css"]
})
export class FoodDirectoryComponent extends CommonSearchComponent implements AfterViewInit, OnInit {

  constructor(httpClient: HttpClient,
    snackBar: MatSnackBar,
    apiPaths: ApiPaths,
    applicationState: ApplicationStateService,
    spinnerService: SpinnerService,
    public userService: UserService) {
    super(httpClient, snackBar, apiPaths, applicationState, spinnerService);
  }

  static readonly NEW_FOOD: string = "new food";

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.search();
    });

    this.search();
  }

  editEnable(row: FoodDirectory): void {
    if (row.edit == true) {
      this.save(row);
    }
    row.edit = !row.edit;
  }

  addNewRow() {
    this.startSpinner();
    let newRow: FoodDirectory = new FoodDirectory();
    newRow.foodDescription = new FoodDescription();
    newRow.foodDescription.name = FoodDirectoryComponent.NEW_FOOD;
    newRow.foodCategory = new FoodCategory();
    newRow.foodCategory.id = 1;
    newRow.owner = this.userService.userInfo.user;

    this.getHttpClient()
      .post(this.getApiPaths().CREATE_FOODS, newRow)
      .toPromise()
      .finally(() => {
        this.stopSpinner();
        this.doSearch(FoodDirectoryComponent.NEW_FOOD,
          null,
          null,
          "0",
          this.paginator.pageSize.toString());
      });
  }

  getEditSaveIcon(edit: boolean): string {
    return !edit ? "edit" : "done";
  }

  save(row: FoodDirectory) {
    this.stopSpinner();
    row.foodCategory.id = this.getFoodCategoryIdByName(
      row.foodCategory.catName
    );

    this.getHttpClient()
      .put(this.getApiPaths().UPDATE_FOODS, row)
      .subscribe(() => {
        this.stopSpinner();
        this.search();
      });


  }

  calculateCalories(row: FoodDirectory) {
    row.calories = 4 * row.carbs + 4 * row.proteins + 9 * row.fats;
  }

  delete(row: FoodDirectory) {
    this.startSpinner();
    this.getHttpClient()
      .get(this.getApiPaths().DELETE_FOODS, {
        params: new HttpParams().append("id", row.id.toString())
      })
      .toPromise()
      .catch((error: HttpErrorResponse) => {
        this.showErrorMessage(error);
      })
      .finally(() => {
        this.search();
        this.stopSpinner();
      });
  }

}

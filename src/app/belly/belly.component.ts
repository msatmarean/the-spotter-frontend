import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { FoodCategory } from "../model/food-category";
import { FoodDirectory } from "../model/food-directory";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BellyEatRequst } from "../model/belly-eat-requst";
import { ConsumedFoodComponent } from "./consumed-food/consumed-food.component";
import { UserService } from "../services/user-service";
import { ApiPaths } from "../services/api.paths";
import { ApplicationStateService } from "../services/application-state.service";
import { CommonSearchComponent } from "../common-search.component";
@Component({
  selector: "app-belly",
  templateUrl: "./belly.component.html",
  styleUrls: ["./belly.component.css"]
})
export class BellyComponent extends CommonSearchComponent {

  @ViewChild("consumedFood")
  consumedFood: ConsumedFoodComponent;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.search();
    });

    this.search();
  }

  constructor(httpClient: HttpClient,
    snackBar: MatSnackBar,
    apiPaths: ApiPaths,
    public dialog: MatDialog,
    applicationState: ApplicationStateService) {
    super(httpClient, snackBar, apiPaths, applicationState);
  }


  add(row: FoodDirectory) {
    this.dialog
      .open(DialogElementsExampleDialog)
      .afterClosed()
      .subscribe((q: any) => {
        if (q > 0) {
          let request: BellyEatRequst = new BellyEatRequst();
          request.foodId = row.id;
          request.qty = q;
          request.consumed = new Date().toJSON();
          this.isLoadingResults = true;
          this.getHttpClient()
            .post(this.getApiPaths().ADD_BELLY, request)
            .toPromise()
            .finally(() => {
              this.isLoadingResults = false;
              this.consumedFood.search();
            });
        }
      });
  }


}

@Component({
  selector: "dialog-box",
  templateUrl: "./dialog.html"
})
export class DialogElementsExampleDialog {
  quantity: number = 100;

  constructor(public dialogRef: MatDialogRef<DialogElementsExampleDialog>) { }

  cancel() {
    this.dialogRef.close();
    this.quantity = 0;
  }

}

import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FoodDirectory } from "../../model/food-directory";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BellyEatRequst } from "../../model/belly-eat-requst";
import { ConsumedFoodComponent } from "./consumed-food/consumed-food.component";
import { UserService } from "../../services/user-service";
import { ApiPaths } from "../../services/api.paths";
import { ApplicationStateService } from "../../services/application-state.service";
import { CommonSearchComponent } from "../common-search.component";
import { SpinnerService } from "../../services/spinner-service";

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
    applicationState: ApplicationStateService,
    private userService: UserService, spinnerService: SpinnerService) {
    super(httpClient, snackBar, apiPaths, applicationState, spinnerService);
  }


  add(row: FoodDirectory) {
    let dialogRef = this.dialog.open(DialogElementsExampleDialog);

    if (row.gramsPerServing > 0) {
      dialogRef.componentInstance.gramsPerServing = row.gramsPerServing;
    }

    dialogRef.afterClosed()
      .subscribe((q: any) => {
        if (q > 0) {
          let request: BellyEatRequst = new BellyEatRequst();
          request.foodId = row.id;
          request.qty = q;
          request.consumed = new Date().toJSON();
          this.startSpinner();
          this.getHttpClient()
            .post(this.getApiPaths().ADD_BELLY, request)
            .toPromise()
            .finally(() => {
              this.stopSpinner()
              this.userService.getConsumedFoodInfo();
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
  quantity: number = 0;
  serving: number = 0;
  gramsPerServing: number = 0;
  constructor(public dialogRef: MatDialogRef<DialogElementsExampleDialog>) {

  }

  close() {
    this.dialogRef.close(this.onClose());
  }

  cancel() {
    this.dialogRef.close(0);
  }

  calculate() {
    if (this.serving > 0) {
      this.quantity = this.serving * this.gramsPerServing;
    }
  }

  onClose(): number {
    this.calculate();
    return this.quantity;

  }
}

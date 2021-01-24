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
import { UserService } from "../services/user-service/user-service";
import { ApiPaths } from "../services/api.paths";
@Component({
  selector: "app-belly",
  templateUrl: "./belly.component.html",
  styleUrls: ["./belly.component.css"]
})
export class BellyComponent implements OnInit {
  displayedColumns: string[] = [
    "foodDescription.name",
    "descripiton",
    "category",
    "calories",
    "proteins",
    "carbs",
    "fats",
    "action"
  ];

  data: FoodDirectory[] = [];
  foodCategories: FoodCategory[] = [];
  selectedCategory: string;
  searchTextBox: string;
  totalElements = 0;
  pageSize: number = 20;
  pageNumber: number = 0;
  isLoadingResults: boolean = false;

  @ViewChild("MatTable") table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("consumedFood")
  consumedFood: ConsumedFoodComponent;

  ngOnInit() {
    this.getFoodCategories();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.search();
    });

    this.paginator.page.subscribe(() => {
      this.search();
    });
  }

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private userService: UserService,
    private apiPaths: ApiPaths
  ) { }

  search() {
    this.doSearch(
      this.searchTextBox,
      this.selectedCategory,
      this.sort.active + "," + this.sort.direction,
      this.paginator.pageIndex.toString()
    );
  }

  doSearch(
    searchTextBox: string,
    selectedCategory: string,
    sort: string,
    page: string
  ) {
    this.isLoadingResults = true;
    let httpParams: HttpParams = new HttpParams();

    if (searchTextBox != null) {
      httpParams = httpParams.append("name", searchTextBox);
    }
    if (selectedCategory != null) {
      httpParams = httpParams.append(
        "categoryId",
        this.getFoodCategoryIdByName(selectedCategory).toString()
      );
    }
    if (sort != null) {
      httpParams = httpParams.append("sort", sort);
    }
    if (page != null) {
      httpParams = httpParams.append("page", page);
    }

    this.httpClient
      .get<any>(this.apiPaths.FIND_FOODS, {
        params: httpParams
      })
      .toPromise()
      .then((response: any) => {
        this.data = response.content;
        this.pageSize = response.size;
        this.totalElements = response.totalElements;
        this.pageNumber = response.pageable.pageNumber;
      })
      .finally(() => {
        this.isLoadingResults = false;
      });
  }

  getFoodCategories() {
    this.httpClient
      .get<FoodCategory[]>(this.apiPaths.FIND_ALL_CATEGORIES)
      .subscribe((response: FoodCategory[]) => {
        this.foodCategories = response;
      });
  }

  getFoodCategoryIdByName(name: string): number {
    let id: number = 0;
    this.foodCategories.forEach(c => {
      if (c.catName == name) {
        id = c.id;
      }
    });
    return id;
  }

  showErrorMessage(error: HttpErrorResponse) {
    this.snackBar.open(
      "Error: " + error.status + " " + error.error.message,
      "Ok",
      {}
    );
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
          this.httpClient
            .post(this.apiPaths.ADD_BELLY, request)
            .toPromise()
            .then(() => {
              this.consumedFood.search();
            })
            .finally(() => {
              this.isLoadingResults = false;
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

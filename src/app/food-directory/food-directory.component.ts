import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatTable } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FoodCategory } from "../model/food-category";
import { FoodDirectory } from "../model/food-directory";
import { MatSort } from "@angular/material/sort";
import { FoodDescription } from "../model/food-description";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiPaths } from "../services/api.paths";
@Component({
  selector: "app-food-directory",
  templateUrl: "./food-directory.component.html",
  styleUrls: ["./food-directory.component.css"]
})
export class FoodDirectoryComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    "foodDescription.name",
    "descripiton",
    "category",
    "calories",
    "proteins",
    "carbs",
    "fats",
    "fiber",
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
  static readonly NEW_FOOD: string = "new food";

  @ViewChild("MatTable") table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private apiPaths: ApiPaths) { }

  editEnable(row: FoodDirectory): void {
    if (row.edit == true) {
      this.save(row);
    }
    row.edit = !row.edit;
  }

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

  addNewRow() {
    let newRow: FoodDirectory = new FoodDirectory();
    newRow.foodDescription = new FoodDescription();
    newRow.foodDescription.name = FoodDirectoryComponent.NEW_FOOD;
    newRow.foodCategory = new FoodCategory();
    newRow.foodCategory.id = 1;

    this.httpClient
      .post(this.apiPaths.CREATE_FOODS, newRow)
      .toPromise()
      .finally(() => {
        this.doSearch(FoodDirectoryComponent.NEW_FOOD, null, null, "0");
        this.table.renderRows;
      });
  }

  getEditSaveIcon(edit: boolean): string {
    return !edit ? "edit" : "done";
  }

  save(row: FoodDirectory) {
    row.foodCategory.id = this.getFoodCategoryIdByName(
      row.foodCategory.catName
    );

    this.calculateCalories(row);

    this.httpClient
      .put(this.apiPaths.UPDATE_FOODS, row)
      .subscribe(() => { });

    this.search();
  }

  calculateCalories(row: FoodDirectory) {
    row.calories = 4 * row.carbs + 4 * row.proteins + 9 * row.fats;
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

  delete(row: FoodDirectory) {
    this.isLoadingResults = true;
    this.httpClient
      .get(this.apiPaths.DELETE_FOODS, {
        params: new HttpParams().append("id", row.id.toString())
      })
      .toPromise()
      .then(() => {
        this.isLoadingResults = false;
        this.snackBar.open(
          "Successfully deleted " + row.foodDescription.name,
          "Ok",
          {
            duration: 2000
          }
        );
        this.search();
      })
      .catch((error: HttpErrorResponse) => {
        this.showErrorMessage(error);
      })
      .finally(() => {
        this.isLoadingResults = false;
      });
  }

  showErrorMessage(error: HttpErrorResponse) {
    this.snackBar.open(
      "Error: " + error.status + " " + error.error.message,
      "Ok",
      {}
    );
  }
}

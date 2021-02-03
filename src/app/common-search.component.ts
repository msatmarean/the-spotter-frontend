
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import {
  Component, ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FoodCategory } from "./model/food-category";
import { FoodDirectory } from "./model/food-directory";
import { KeyValueModel } from "./model/key-value-model";
import { ApiPaths } from "./services/api.paths";
import { ApplicationStateService } from "./services/application-state.service";
import { SpinnerService } from "./services/spinner-service";

export class CommonSearchComponent {

  data: FoodDirectory[] = [];
  foodCategories: FoodCategory[] = [];
  selectedCategory: string;
  searchTextBox: string;
  totalElements = 0;
  pageSize: number = 10;
  pageNumber: number = 0;
  sortOptions: KeyValueModel[] = [];
  sort: string = "foodDescription.name";
  direction: string = "asc";

  @ViewChild("paginator") paginator: MatPaginator;

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private apiPaths: ApiPaths,
    private applicationState: ApplicationStateService, private spinnerService: SpinnerService) {
    this.initSortOptions();
    this.getFoodCategories();
  }

  initSortOptions() {
    this.sortOptions.push(new KeyValueModel("foodDescription.name", "name"));
    this.sortOptions.push(new KeyValueModel("calories", "calories"));
    this.sortOptions.push(new KeyValueModel("proteins", "proteins"));
    this.sortOptions.push(new KeyValueModel("carbs", "carbohidrates"));
    this.sortOptions.push(new KeyValueModel("fats", "fats"));
  }

  search() {
    this.doSearch(
      this.searchTextBox,
      this.selectedCategory,
      this.sort + "," + this.direction,
      this.paginator.pageIndex.toString(),
      this.paginator.pageSize.toString()
    );
  }

  doSearch(
    searchTextBox: string,
    selectedCategory: string,
    sort: string,
    page: string,
    size: string
  ) {
    this.spinnerService.startSpinner();
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
    if (size != null) {
      httpParams = httpParams.append("size", size);
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
        this.spinnerService.stopSpinner();
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

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  getApiPaths(): ApiPaths {
    return this.apiPaths;
  }

  showErrorMessage(error: HttpErrorResponse) {
    this.snackBar.open(
      "Error: " + error.status + " " + error.error.message,
      "Ok",
      {}
    );
  }

  getApplicationState(): ApplicationStateService {
    return this.applicationState;
  }

  toggleSort() {
    if (this.direction == "asc") {
      this.direction = "desc";
    } else {
      this.direction = "asc";
    }

    this.search();
  }

  getSortIcon(): string {
    return this.direction == "asc" ? "keyboard_arrow_up" : "keyboard_arrow_down";
  }

  onSortChange(option: KeyValueModel) {
    this.sort = option.key;
    this.search();
  }

  onCategoryChange(hasValue: boolean) {
    if (!hasValue) {
      this.selectedCategory = null;
    }
    this.search();
  }

  stateTextForStyle(): string {
    return this.getApplicationState().stateTextForStyle();
  }

  startSpinner() {
    this.spinnerService.startSpinner();
  }

  stopSpinner() {
    this.spinnerService.stopSpinner();
  }

  isSpinning(): boolean {
    return this.spinnerService.isSpinning();
  }
}



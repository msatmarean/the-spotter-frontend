import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatList, MatListOption } from "@angular/material/list";
import { FoodCategory } from "../model/food-category";
import { ApiPaths } from "../services/api.paths";
@Component({
  selector: "manage-categories",
  templateUrl: "./manage-categories.component.html",
  styleUrls: ["./manage-categories.component.css"]
})
export class ManageCategories implements OnInit {

  constructor(private httpClient: HttpClient, public dialog: MatDialog, private apiPaths: ApiPaths) {
  }

  categories: FoodCategory[];
  selected: number[] = [];

  ngOnInit(): void {
    this.getFoodCategories();
  }

  getFoodCategories() {
    this.httpClient
      .get<FoodCategory[]>(this.apiPaths.FIND_ALL_CATEGORIES)
      .subscribe((response: FoodCategory[]) => {
        this.categories = response;
      });
  }

  addNew() {
    this.dialog.open(AddCategoryDialog).afterClosed().subscribe((name: string) => {
      if (name != undefined) {
        this.httpClient
          .post(this.apiPaths.CREATE_CATEGORIES + "?name=" + name, null)
          .subscribe(() => {
            this.getFoodCategories();
          });
      }
    })
  }

  onGroupsChange(options: MatListOption[]) {
    this.selected = options.map(o => o.value);
  }

  delete() {

    this.httpClient
      .put(this.apiPaths.DELETE_CATEGORIES, this.selected)
      .subscribe(() => {
        this.getFoodCategories();
      });
  }

}

@Component({
  selector: "add-category-dialog-box",
  templateUrl: "./add-category-dialog-box.html"
})
export class AddCategoryDialog {
  name: string;

  constructor(public dialogRef: MatDialogRef<AddCategoryDialog>) { }

  cancel() {
    this.dialogRef.close();
    this.name = null;
  }

}



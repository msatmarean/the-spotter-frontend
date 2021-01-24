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
@Component({
  selector: "manage-categories",
  templateUrl: "./manage-categories.component.html",
  styleUrls: ["./manage-categories.component.css"]
})
export class ManageCategories implements OnInit {

  constructor(private httpClient: HttpClient, public dialog: MatDialog) {
  }

  categories: FoodCategory[];
  selected: number[] = [];

  ngOnInit(): void {
    this.getFoodCategories();
  }

  getFoodCategories() {
    this.httpClient
      .get<FoodCategory[]>("http://localhost:8080/backend/categories/getAll")
      .subscribe((response: FoodCategory[]) => {
        this.categories = response;
      });
  }

  addNew() {
    this.dialog.open(AddCategoryDialog).afterClosed().subscribe((name: string) => {
      if (name != undefined) {
        this.httpClient
          .post("http://localhost:8080/backend/categories/create?name=" + name, null)
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
      .put("http://localhost:8080/backend/categories/delete", this.selected)
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



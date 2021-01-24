import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";

@Component({
  selector: "app-app-container",
  templateUrl: "./app-container.component.html",
  styleUrls: ["./app-container.component.css"]
})
export class AppContainerComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  @Input()
  selectedParent: String;
  selectedChild: String;

  @ViewChild("drawer")
  drawer: MatDrawer;

  private static BREADCRUMB_DELIMITER: string = " > ";
  @Output()
  selection: EventEmitter<String> = new EventEmitter<String>();

  setParent(menu: string): void {
    this.selectedParent = menu;
    this.selectedChild = null;
    this.selection.emit(
      AppContainerComponent.BREADCRUMB_DELIMITER + this.selectedParent
    );
  }

  setChild(menu: string): void {
    this.selectedChild = menu;
    this.selection.emit(
      AppContainerComponent.BREADCRUMB_DELIMITER +
      this.selectedParent +
      AppContainerComponent.BREADCRUMB_DELIMITER +
      this.selectedChild
    );
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ApplicationStateService } from "../../services/application-state.service";
import { SpinnerService } from "../../services/spinner-service";

@Component({
  selector: "app-app-container",
  templateUrl: "./app-container.component.html",
  styleUrls: ["./app-container.component.css"]
})
export class AppContainerComponent implements OnInit {
  constructor(private applicationState: ApplicationStateService, private spinnerService: SpinnerService) {
    this.isMobile = this.applicationState.getIsMobileResolution();
  }

  ngOnInit() { }

  @Input()
  selectedParent: String;
  selectedChild: String;

  isMobile: boolean;

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
    if (this.isMobile) {
      this.toggleDrawer()
    }

    if (this.selectedParent == this.selectedChild) {
      this.selection.emit(
        AppContainerComponent.BREADCRUMB_DELIMITER +
        this.selectedParent
      );
    } else {
      this.selection.emit(
        AppContainerComponent.BREADCRUMB_DELIMITER +
        this.selectedParent +
        AppContainerComponent.BREADCRUMB_DELIMITER +
        this.selectedChild
      );
    }

  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  closeDrawer() {
    this.drawer.close();
  }

  openDrawer() {
    this.drawer.open();
  }

  isSpinnerRunning(): string {
    return this.spinnerService.isSpinning() ? "show-spinner" : "hide-spinner";
  }
}

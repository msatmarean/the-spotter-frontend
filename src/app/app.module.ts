import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AppContainerComponent } from "./app-container/app-container.component";
import { FoodDirectoryComponent } from "./food-directory/food-directory.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  BellyComponent,
  DialogElementsExampleDialog
} from "./belly/belly.component";
import { ConsumedFoodComponent } from './belly/consumed-food/consumed-food.component';
import { RouterModule, Routes } from "@angular/router";
import { SecurityService } from "./services/security/security.component";
import { TokenInterceptorService } from "./services/security/token-interceptor";
import { UserComponent } from "./user-component/user.component";
import { UserService } from "./services/user-service";
import { AddCategoryDialog, ManageCategories } from "./manage-categories/manage-categories.component";
import { HttpInterceptorService } from "./services/security/http-interceptor";
import { ApiPaths } from "./services/api.paths";
import { MatCardModule } from '@angular/material/card';
import { ApplicationStateService } from "./services/application-state.service";
const appRoutes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'authConsumerService', component: AppComponent },
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    AppComponent,
    AppContainerComponent,
    FoodDirectoryComponent,
    BellyComponent,
    DialogElementsExampleDialog,
    ConsumedFoodComponent,
    UserComponent,
    ManageCategories,
    AddCategoryDialog
  ],
  entryComponents: [BellyComponent, DialogElementsExampleDialog, AddCategoryDialog],
  bootstrap: [AppComponent],
  providers: [SecurityService,
    TokenInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    UserService,
    ApiPaths,
    ApplicationStateService,
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
})
export class AppModule { }

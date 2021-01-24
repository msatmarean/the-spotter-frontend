import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { SecurityService } from './security.component';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar, private securityService: SecurityService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(evt => { }),
            catchError((error: HttpResponse<any>) => {
                if (error.status == 401 || error.status == 403) {
                    if (this.securityService.isUserLoggedIn()) {
                        this.snackBar.open("Session expired", "Ok", { duration: 2000 });
                        this.securityService.logOut();
                    } else {
                        this.snackBar.open("You are not logged in!", "Ok", { duration: 2000 });
                    }
                } else {
                    this.snackBar.open("Error: " + error.status + " " + error.body, "Ok", { duration: 2000 });
                }
                return throwError(error);
            })
        );

    }
}
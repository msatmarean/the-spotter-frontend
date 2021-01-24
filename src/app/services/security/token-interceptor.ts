import { Observable } from "rxjs";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SecurityService } from "./security.component";
import { ApiPaths } from "../api.paths";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private apiPaths: ApiPaths) {
    }

    readonly HEADER_NAME: string = "Authorization";
    readonly BEARER: string = "Bearer ";

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.startsWith(this.apiPaths.API_BASE_URL)) {
            const token: string = sessionStorage.getItem(SecurityService.TOKEN);
            if (token) {
                let headers: HttpHeaders = request.headers;
                headers = headers.set(this.HEADER_NAME, this.BEARER + token);
                request = request.clone({
                    headers: headers
                });
            }
        }
        return next.handle(request);
    }

}
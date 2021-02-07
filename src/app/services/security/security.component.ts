import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { UserService } from "../user-service";
import { UserInfo } from "../../model/user-info";
import { TokenRequestModel } from "./token-request-model";
import { environment } from "../../../environments/environment";
import { SpinnerService } from "../spinner-service";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({
    providedIn: "root"
})
export class SecurityService {
    readonly CLIENT_ID = environment.clientId;
    readonly CLIENT_SECRET = environment.clientSecret;
    readonly RESPONSE_TYPE = "code";
    readonly SCOPE = "openid+profile+email";
    readonly REDIRECT_URI = environment.redirectUri;
    readonly IDP_AUTHORIZATION_CODE_REQUEST_ENDPOINT = environment.idpAuthorizationCodeRequestEndpoint;
    readonly IDP_TOKEN_REQUEST_ENDPOINT = environment.idpTokenRequestEndpoint;

    static readonly TOKEN = "token"

    private userLoggedIn: boolean = false;
    private state: string;
    userLoginEvent: EventEmitter<string> = new EventEmitter();

    constructor(private httpClinet: HttpClient, private userService: UserService, private spinnerService: SpinnerService, private snackBar: MatSnackBar,) {
        this.state = this.createStateToken();
    }

    requestAuthorizationCode(): string {
        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams.append("client_id", this.CLIENT_ID);
        httpParams = httpParams.append("response_type", this.RESPONSE_TYPE);
        httpParams = httpParams.append("scope", this.SCOPE);
        httpParams = httpParams.append("redirect_uri", this.REDIRECT_URI);
        httpParams = httpParams.append("state", this.state);

        return this.IDP_AUTHORIZATION_CODE_REQUEST_ENDPOINT + "?" + httpParams.toString();

    }

    getAccessToken(state: string, code: string, scope: string) {
        this.spinnerService.startSpinner();

        if (this.state == state) {
            this.snackBar.open("Malicios activity detected. Go away!", "Ok", { duration: 2000 });
            this.logOut();
            this.spinnerService.stopSpinner();
            return;
        }

        let request: TokenRequestModel = new TokenRequestModel();
        request.client_id = this.CLIENT_ID;
        request.client_secret = this.CLIENT_SECRET;
        request.code = code;
        request.grant_type = "authorization_code";
        request.redirect_uri = this.REDIRECT_URI;

        this.httpClinet.post(this.IDP_TOKEN_REQUEST_ENDPOINT, request).toPromise().then((token: any) => {
            sessionStorage.setItem(SecurityService.TOKEN, token.id_token);
            this.userService.getUserInfo().then(() => {
                this.userLoggedIn = true;
                this.userLoginEvent.emit("userLoggedIn");
            }).catch((ex: any) => {
                console.debug("catch1");
                console.debug(ex);
                this.handleLoginFail();
            });
            this.userService.getConsumedFoodInfo();
        }).catch((ex: any) => {
            console.debug("catch2");
            console.debug(ex);
            this.handleLoginFail();
        }).finally(() => { this.spinnerService.stopSpinner() });

    }

    isUserLoggedIn(): boolean {
        return this.userLoggedIn || !(sessionStorage.getItem(SecurityService.TOKEN) == null);
    }

    handleLoginFail() {
        this.snackBar.open("Login Failed", "Ok", { duration: 2000 });
        this.logOut();
    }

    logOut() {
        this.userLoggedIn = false;
        sessionStorage.clear();
        this.userService.logOut();
        this.userLoginEvent.emit("userLoggedOut");
    }

    createStateToken(): string {
        let result: string = "";
        let chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 30; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }

        return result;
    }



}
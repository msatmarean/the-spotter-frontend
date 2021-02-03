import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { UserService } from "../user-service";
import { UserInfo } from "../../model/user-info";
import { TokenRequestModel } from "./token-request-model";
import { environment } from "../../../environments/environment";
import { SpinnerService } from "../spinner-service";

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
    readonly STATE = "t_LDYf9I_uZkyfdRigGsGbHpyux87I_ROfSNZUtE3f0%3D";
    static readonly TOKEN = "token"

    private userLoggedIn: boolean = false;
    userLoginEvent: EventEmitter<string> = new EventEmitter();

    constructor(private httpClinet: HttpClient, private userService: UserService, private spinnerService: SpinnerService) {

    }

    requestAuthorizationCode(): string {
        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams.append("client_id", this.CLIENT_ID);
        httpParams = httpParams.append("response_type", this.RESPONSE_TYPE);
        httpParams = httpParams.append("scope", this.SCOPE);
        httpParams = httpParams.append("redirect_uri", this.REDIRECT_URI);
        httpParams = httpParams.append("state", this.STATE);

        return this.IDP_AUTHORIZATION_CODE_REQUEST_ENDPOINT + "?" + httpParams.toString();

    }

    getAccessToken(state: string, code: string, scope: string) {
        let request: TokenRequestModel = new TokenRequestModel();
        this.spinnerService.startSpinner();

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
            }).catch((ex: any) => { this.handleLoginFail(); });
            this.userService.getConsumedFoodInfo();
        }).catch((ex: any) => {
            this.handleLoginFail();
        }).finally(() => { this.spinnerService.stopSpinner() });

    }

    isUserLoggedIn(): boolean {
        return this.userLoggedIn || !(sessionStorage.getItem(SecurityService.TOKEN) == null);
    }

    handleLoginFail() {
        console.debug("Error login")
        this.logOut();
    }

    logOut() {
        this.userLoggedIn = false;
        sessionStorage.clear();
        this.userService.logOut();
        this.userLoginEvent.emit("userLoggedOut");
    }

}
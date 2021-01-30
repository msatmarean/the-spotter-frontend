import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../user-service/user-service";
import { UserInfo } from "../../model/user-info";
import { TokenRequestModel } from "./token-request-model";

@Injectable({
    providedIn: "root"
})
export class SecurityService {
    readonly CLIENT_ID = "870757666473-jqu3779nodvb44uuvbn67ua08sb5cl2e.apps.googleusercontent.com";
    readonly CLIENT_SECRET = "0NoVv8xZRGmtz69h519TMjIB";
    readonly RESPONSE_TYPE = "code";
    readonly SCOPE = "openid+profile+email";
    readonly REDIRECT_URI = "http://localhost:4200/authConsumerService";
    readonly IDP_AUTHORIZATION_CODE_REQUEST_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
    readonly IDP_TOKEN_REQUEST_ENDPOINT = "https://oauth2.googleapis.com/token";
    readonly STATE = "t_LDYf9I_uZkyfdRigGsGbHpyux87I_ROfSNZUtE3f0%3D";
    static readonly TOKEN = "token"

    private userLoggedIn: boolean = false;

    constructor(private httpClinet: HttpClient, private userService: UserService) {

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

        request.client_id = this.CLIENT_ID;
        request.client_secret = this.CLIENT_SECRET;
        request.code = code;
        request.grant_type = "authorization_code";
        request.redirect_uri = this.REDIRECT_URI;

        this.httpClinet.post(this.IDP_TOKEN_REQUEST_ENDPOINT, request).toPromise().then((token: any) => {
            sessionStorage.setItem(SecurityService.TOKEN, token.id_token);
            this.userService.getUserInfo();
            this.userLoggedIn = true;
        }).catch((ex: any) => {
            console.debug("exception");
        });

    }

    isUserLoggedIn(): boolean {
        return !(sessionStorage.getItem(SecurityService.TOKEN) == null);
    }

    logOut() {
        this.userLoggedIn = false;
        sessionStorage.clear();
        this.userService.userInfo = new UserInfo();
    }

}
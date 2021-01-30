export interface Environment {
    target: string;
    protocol: string;
    apiRoot: string;
    backendContextPath: string;
    redirectUri: string;
    idpAuthorizationCodeRequestEndpoint: string;
    idpTokenRequestEndpoint: string;
    clientId: string;
    clientSecret: string;
}

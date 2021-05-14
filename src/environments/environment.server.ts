import { Environment } from "./environment.interface";

export const environment: Environment = {
    target: "prod",
    protocol: "https://",
    apiRoot: "the-spotter-backend.herokuapp.com",
    backendContextPath: "",
    redirectUri: "https://the-spotter.herokuapp.com/authConsumerService",
    idpAuthorizationCodeRequestEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    idpTokenRequestEndpoint: "https://oauth2.googleapis.com/token",
    clientId: "870757666473-jqu3779nodvb44uuvbn67ua08sb5cl2e.apps.googleusercontent.com",
    clientSecret: "0NoVv8xZRGmtz69h519TMjIB"
};

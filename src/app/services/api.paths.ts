import { environment } from "../environments/environment";

export class ApiPaths {
    API_BASE_URL: string = environment.protocol + environment.apiRoot + environment.backendContextPath;
    private FOODS: string = this.API_BASE_URL + "/foods";
    private CATEGORIES: string = this.API_BASE_URL + "/categories";
    private BELLY: string = this.API_BASE_URL + "/belly";
    private USER: string = this.API_BASE_URL + "/user";

    FIND_ALL_CATEGORIES: string = this.CATEGORIES + "/getAll";
    CREATE_CATEGORIES: string = this.CATEGORIES + "/create";
    DELETE_CATEGORIES: string = this.CATEGORIES + "/delete";

    FIND_FOODS: string = this.FOODS + "/find";
    CREATE_FOODS: string = this.FOODS + "/create";
    UPDATE_FOODS: string = this.FOODS + "/update";
    DELETE_FOODS: string = this.FOODS + "/delete";

    ADD_BELLY: string = this.BELLY + "/add";
    DELETE_BELLY: string = this.BELLY + "/delete"
    BELLY_CONSUMED_ON: string = this.BELLY + "/consumedOn";

    USER_INFO: string = this.USER + "/info";
}
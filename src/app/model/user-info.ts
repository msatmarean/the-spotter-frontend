import { UserUpdateRequest } from "./user-update-request";

export class UserInfo extends UserUpdateRequest {
    name: string;
    givenName: string;
    mail: string;
    pictureUrl: string;
    calloriesGoal: number;
    carbsGoal: number;
    fatsGoal: number;
    proteinsGoal: number;
}
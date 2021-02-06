import { User } from "./user";
import { UserUpdateRequest } from "./user-update-request";

export class UserInfo {
    name: string;
    givenName: string;
    mail: string;
    pictureUrl: string;
    user: User;
    calloriesGoal: number;
}
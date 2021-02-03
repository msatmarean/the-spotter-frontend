import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SpinnerService {
    private spin: boolean;

    constructor() {
        this.spin = false;
    }

    startSpinner() {
        this.spin = true;
    }

    stopSpinner() {
        this.spin = false;
    }

    isSpinning(): boolean {
        return this.spin;
    }

}
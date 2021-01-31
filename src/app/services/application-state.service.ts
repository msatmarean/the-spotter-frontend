import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationStateService {

  private isMobileResolution: boolean;

  public getIsMobileResolution(): boolean {
    return window.innerWidth < 768;
  }

  public stateTextForStyle(): string {
    return this.getIsMobileResolution() ? "mobile" : "desktop";
  }

}

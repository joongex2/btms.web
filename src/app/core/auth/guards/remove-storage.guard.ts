import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { TargetManagementService } from "app/modules/target-info/target-management/target-management.service";

@Injectable({
    providedIn: 'root'
})
export class RemoveStorageGuard implements CanDeactivate<any> {
    constructor(private _targetManagementService: TargetManagementService) { }

    canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // let url: string = state.url;
        // console.log('Url: ' + url);
        this._targetManagementService.clear();

        return true;
    }
} 
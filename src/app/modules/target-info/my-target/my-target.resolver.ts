import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { MasterService } from "app/modules/admin/master/master.service";
import { OrganizationService } from "app/modules/admin/organization/organization.service";
import { LookupService } from "app/shared/services/lookup.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrganizesResolver implements Resolve<any>
{
    constructor(private _organizationService: OrganizationService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._organizationService.getOrganizations();
    }
}

@Injectable({
    providedIn: 'root'
})
export class StatusesResolver implements Resolve<any>
{
    constructor(private _lookupService: LookupService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._lookupService.getLookups('BTMS_01_STATUS');
    }
}

@Injectable({
    providedIn: 'root'
})
export class DocumentTypesResolver implements Resolve<any>
{
    constructor(private _lookupService: LookupService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._lookupService.getLookups('DOCUMENT_TYPE');
    }
}


@Injectable({
    providedIn: 'root'
})
export class BusResolver implements Resolve<any>
{
    constructor(private _masterService: MasterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._masterService.getMasters('BUSINESS_UNIT');
    }
}

@Injectable({
    providedIn: 'root'
})
export class SubBusResolver implements Resolve<any>
{
    constructor(private _masterService: MasterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._masterService.getMasters('SUB_BUSINESS_UNIT');
    }
}

@Injectable({
    providedIn: 'root'
})
export class PlantsResolver implements Resolve<any>
{
    constructor(private _masterService: MasterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._masterService.getMasters('PLANT');
    }
}

@Injectable({
    providedIn: 'root'
})
export class DivisionsResolver implements Resolve<any>
{
    constructor(private _masterService: MasterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._masterService.getMasters('DIVISION');
    }
}
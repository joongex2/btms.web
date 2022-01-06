import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Dashboard1Service } from './dashboard1.service';

@Injectable({
    providedIn: 'root'
})
export class Dashboard1Resolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _dashboard1Service: Dashboard1Service)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._dashboard1Service.getData();
    }
}

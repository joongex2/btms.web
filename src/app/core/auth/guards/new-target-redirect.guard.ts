import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewTargetRedirectGuard implements CanActivate {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this._userService.user$.pipe(map((user: User) => {
            if (user.organizes?.length === 1 && user.organizes?.[0]?.roles?.findIndex(v => v.roleCode === 'D01') !== -1) {
                this._router.navigate([`target-info/new-target/${user.organizes[0].organizeCode}`]);
                return false;
            } else {
                return true;
            }
        }));
    }
}
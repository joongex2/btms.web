import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewTargetGuard implements CanActivate {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this._userService.user$.pipe(map((user: User) => {
            const org = user.organizes.find(v => v.organizeCode === route.params.organizeCode);
            return org?.roles.findIndex(v => v.roleCode === 'D01') !== -1;
        }));
    }
}
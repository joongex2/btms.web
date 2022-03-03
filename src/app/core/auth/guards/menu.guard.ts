import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { Observable, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuGuard implements CanActivate, CanActivateChild {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.menuCheck(state.url.split('?')[0]);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.menuCheck(state.url.split('?')[0]);
    }

    menuCheck(stateUrl: string): Observable<boolean> {
        return this._userService.user$.pipe(switchMap((user) => {
            for (let menu of user.menus) {
                if (!menu.children) continue;
                for (let childMenu of menu.children) {
                    if (childMenu.link == stateUrl && childMenu.check) {
                        return of(true);
                    }
                }
            }
            this._router.navigate(['403-forbidden']);
            return of(false);
        }));
    }
}
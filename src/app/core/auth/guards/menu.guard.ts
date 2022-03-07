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
        return this.menuCheck(this.getConfiguredUrl(route));
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.menuCheck(this.getConfiguredUrl(route));
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

    getResolvedUrl(route: ActivatedRouteSnapshot): string {
        return '/' + route.pathFromRoot
            .map(v => v.url.map(segment => segment.toString()).join('/'))
            .filter(v => v)
            .join('/');
    }

    getConfiguredUrl(route: ActivatedRouteSnapshot): string {
        return '/' + route.pathFromRoot
            .filter(v => v.routeConfig && v.routeConfig.path)
            .map(v => v.routeConfig!.path)
            .join('/');
    }
}
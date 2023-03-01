import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { TargetResultService } from 'app/modules/target-result/target-result.service';
import { getBaseUrl } from 'app/shared/helpers/get-base-url';
import { ResultMapper } from 'app/shared/interfaces/result-mapper.interface';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _targetResultService: TargetResultService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for refresh access token
     */
    set refreshToken(refreshToken: string) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<ResultMapper>(getBaseUrl('/v1/Auths/sign-in'), credentials).pipe(
            switchMap((response: ResultMapper) => {
                if (!response.didError) {
                    // Store the access token in the local storage
                    this.accessToken = response.model.accessToken;

                    // Store the refresh access token in the local storage
                    this.refreshToken = response.model.refreshToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.model.user;

                    // Set the navigation menu
                    let navigation = response.model.user.menus;
                    navigation = this.filterCheckMenu(navigation);
                    this._navigationService.navigation = {
                        compact: navigation,
                        default: navigation,
                        futuristic: navigation,
                        horizontal: navigation
                    }
                }

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post(getBaseUrl('/v1/Auths/refresh-token'), {
            refreshToken: this.refreshToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Store the refresh token in the local storage
                this.refreshToken = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Set the navigation menu
                let navigation = response.user.menus;
                navigation = this.filterCheckMenu(navigation);
                this._navigationService.navigation = {
                    compact: navigation,
                    default: navigation,
                    futuristic: navigation,
                    horizontal: navigation
                }

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Remove the refresh token from the local storage
        localStorage.removeItem('refreshToken');

        // clear plan statuses
        this._targetResultService.clear();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken || !this.refreshToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    filterCheckMenu(navigation: FuseNavigationItem[]): FuseNavigationItem[] {
        for (let nav of navigation) {
            nav.children = nav.children.filter((child) => child.check);
        }
        return navigation.filter((nav) => nav.children.length != 0);
    }
}

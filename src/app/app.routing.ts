import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/dashboard1'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/dashboard1'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},

            {path: 'dashboards', children: [
                {path: 'dashboard1', loadChildren: () => import('app/modules/dashboards/dashboard1/dashboard1.module').then(m => m.Dashboard1Module)},
                {path: 'dashboard2', loadChildren: () => import('app/modules/dashboards/dashboard2/dashboard2.module').then(m => m.Dashboard2Module)},
                {path: 'dashboard3', loadChildren: () => import('app/modules/dashboards/dashboard3/dashboard3.module').then(m => m.Dashboard3Module)}
            ]},
            {path: 'target-info', children: [
                {path: 'my-target', loadChildren: () => import('app/modules/target-info/my-target/my-target.module').then(m => m.MyTargetModule)},
                {path: 'my-target/:runningNo', loadChildren: () => import('app/modules/target-info/target-detail/target-detail.module').then(m => m.TargetDetailModule)},
                {path: 'old-target', loadChildren: () => import('app/modules/target-info/old-target/old-target.module').then(m => m.OldTargetModule)},
                {path: 'new-target', loadChildren: () => import('app/modules/target-info/new-target/new-target.module').then(m => m.NewTargetModule)}                
            ]},
            {path: 'target-result', children: [
                {path: 'target-entry', loadChildren: () => import('app/modules/target-result/target-entry/target-entry.module').then(m=>m.TargetEntryModule)},
                {path: 'target-entry/:runningNo', loadChildren: () => import('app/modules/target-result/target-entry-detail/target-entry-detail.module').then(m=>m.TargetEntryDetailModule)}
            ]},
            {path: 'super-admin', children: [
                {path: 'user-group', loadChildren: () => import('app/modules/super-admin/user-group/user-group.module').then(m => m.UserGroupModule)},
                {path: 'user', loadChildren: () => import('app/modules/super-admin/user/user.module').then(m => m.UserModule)},
                {path: 'roles', loadChildren: () => import('app/modules/super-admin/role/role.module').then(m => m.RoleModule)},
                {path: 'menu', loadChildren: () => import('app/modules/super-admin/menu/menu.module').then(m => m.MenuModule)},
                {path: 'document-permission', loadChildren: () => import('app/modules/super-admin/document-permission/document-permission.module').then(m => m.DocumentPermissionModule)}
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];

import { Route } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    // { path: '', pathMatch: 'full', redirectTo: 'dashboards/dashboard1' },
    { path: '', pathMatch: 'full', redirectTo: 'welcome' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    // { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards/dashboard1' },
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'welcome' },

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
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
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
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'welcome', loadChildren: () => import('app/modules/welcome/welcome.module').then(m => m.WelcomeModule)
            },
            {
                path: 'dashboards', children: [
                    { path: 'dashboard1', loadChildren: () => import('app/modules/dashboards/dashboard1/dashboard1.module').then(m => m.Dashboard1Module) },
                    { path: 'dashboard2', loadChildren: () => import('app/modules/dashboards/dashboard2/dashboard2.module').then(m => m.Dashboard2Module) },
                    { path: 'dashboard3', loadChildren: () => import('app/modules/dashboards/dashboard3/dashboard3.module').then(m => m.Dashboard3Module) }
                ]
            },
            {
                path: 'target-info', children: [
                    { path: 'my-target', loadChildren: () => import('app/modules/target-info/my-target/my-target.module').then(m => m.MyTargetModule) },
                    { path: 'old-target', loadChildren: () => import('app/modules/target-info/old-target/old-target.module').then(m => m.OldTargetModule) },
                    { path: 'new-target', loadChildren: () => import('app/modules/target-info/new-target/new-target.module').then(m => m.NewTargetModule) }
                ]
            },
            {
                path: 'target-result', children: [
                    { path: 'target-entry', loadChildren: () => import('app/modules/target-result/target-entry/target-entry.module').then(m => m.TargetEntryModule) },
                    { path: 'cause-edit-target', loadChildren: () => import('app/modules/target-result/cause-edit-target/cause-edit-target.module').then(m => m.CauseEditTargetModule) },
                    { path: 'result-info', loadChildren: () => import('app/modules/target-result/result-info/result-info.module').then(m => m.ResultInfoModule) },
                ]
            },
            {
                path: 'report', children: [
                    { path: 'export-report', loadChildren: () => import('app/modules/report/export-report/export-report.module').then(m => m.ExportReportModule) },
                    { path: 'document-report', loadChildren: () => import('app/modules/report/document-report/document-report.module').then(m => m.DocumentReportModule) },
                    { path: 'standard-form', loadChildren: () => import('app/modules/report/standard-form/standard-form.module').then(m => m.StandardFormModule) },
                    { path: 'annual-report', loadChildren: () => import('app/modules/report/annual-report/annual-report.module').then(m => m.AnnualReportModule) },
                    { path: 'target-track', loadChildren: () => import('app/modules/report/target-track/target-track.module').then(m => m.TargetTrackModule) },
                    { path: 'save-cause-track', loadChildren: () => import('app/modules/report/save-cause-track/save-cause-track.module').then(m => m.SaveCauseTrackModule) },
                ]
            },
            {
                path: 'admin', children: [
                    { path: 'user', loadChildren: () => import('app/modules/admin/user/user.module').then(m => m.UserModule) },
                ]
            },
            {
                path: 'super-admin', children: [
                    { path: 'user-group', loadChildren: () => import('app/modules/super-admin/user-group/user-group.module').then(m => m.UserGroupModule) },
                    { path: 'role', loadChildren: () => import('app/modules/super-admin/role/role.module').then(m => m.RoleModule) },
                    { path: 'admin-user', loadChildren: () => import('app/modules/super-admin/admin-user/admin-user.module').then(m => m.AdminUserModule) },
                    { path: 'master', loadChildren: () => import('app/modules/super-admin/master/master.module').then(m => m.MasterModule) },
                    { path: 'organization', loadChildren: () => import('app/modules/super-admin/organization/organization.module').then(m => m.OrganizationModule) },
                    { path: 'document-control', loadChildren: () => import('app/modules/super-admin/document-control/document-control.module').then(m => m.DocumentControlModule) },
                    { path: 'lookup', loadChildren: () => import('app/modules/super-admin/lookup/lookup.module').then(m => m.LookupModule) },
                    { path: 'target-template', loadChildren: () => import('app/modules/super-admin/target-template/target-template.module').then(m => m.TargetTemplateModule) },
                ]
            },
            { path: '403-forbidden', loadChildren: () => import('app/modules/error/error-403/error-403.module').then(m => m.Error403Module) },

            // 404 & Catch all
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module) },
            { path: '**', redirectTo: '404-not-found' }
        ]
    }
];

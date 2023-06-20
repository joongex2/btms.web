import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from './dashboard.resolvers';

export const dashboardRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: DashboardComponent,
        resolve: {
            data: DashboardResolver
        }
    }
];

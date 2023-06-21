import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, PlantsResolver } from 'app/shared/resolver';
import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from './dashboard.resolvers';

export const dashboardRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: DashboardComponent,
        resolve: {
            data: DashboardResolver,
            bus: BusResolver,
            plants: PlantsResolver
        }
    }
];

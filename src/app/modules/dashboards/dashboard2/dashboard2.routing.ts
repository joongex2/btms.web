import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DashboardPlatnsResolver, PlantsResolver, SubBusResolver } from 'app/shared/resolver';
import { Dashboard2Component } from './dashboard2.component';
import { DashboardResolver } from '../dashboard.resolvers';


export const dashboard2Routes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: Dashboard2Component,
        resolve: {
            data: DashboardResolver,
            bus: BusResolver,
            subBus: SubBusResolver,
            plants: DashboardPlatnsResolver
        }
    }
];

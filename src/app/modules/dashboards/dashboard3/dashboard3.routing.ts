import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DashboardPlatnsResolver, PlantsResolver, SubBusResolver } from 'app/shared/resolver';
import { Dashboard3Component } from './dashboard3.component';
import { DashboardResolver } from '../dashboard.resolvers';


export const dashboard3Routes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: Dashboard3Component,
        resolve: {
            data: DashboardResolver,
            bus: BusResolver,
            subBus: SubBusResolver,
            plants: DashboardPlatnsResolver
        }
    }
];

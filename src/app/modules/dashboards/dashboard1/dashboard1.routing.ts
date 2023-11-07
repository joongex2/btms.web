import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DashboardPlatnsResolver, PlantsResolver, SubBusResolver } from 'app/shared/resolver';
import { Dashboard1Component } from './dashboard1.component';
import { DashboardResolver } from '../dashboard.resolvers';


export const dashboard1Routes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: Dashboard1Component,
        resolve: {
            data: DashboardResolver,
            bus: BusResolver,
            subBus: SubBusResolver,
            plants: DashboardPlatnsResolver
        }
    }
];

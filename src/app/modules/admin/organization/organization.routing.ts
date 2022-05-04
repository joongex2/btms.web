import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, SubBusResolver, PlantsResolver, DivisionsResolver } from 'app/shared/resolver';
import { OrganizationComponent } from './organization.component';

export const organizationRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: OrganizationComponent,
        resolve: {
            bus: BusResolver,
            subBus: SubBusResolver,
            plants: PlantsResolver,
            divisions: DivisionsResolver
        }
    }
];

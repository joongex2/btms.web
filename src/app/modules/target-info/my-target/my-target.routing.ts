import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { TargetManagementComponent } from '../target-management/target-management.component';
import { MyTargetListComponent } from './my-target-list/my-target-list.component';
import { MyTargetComponent } from './my-target.component';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, StatusesResolver, SubBusResolver } from './my-target.resolver';

export const myTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: MyTargetComponent,
        children: [
            {
                path: '',
                component: MyTargetListComponent,
                resolve: {
                    organizes: OrganizesResolver,
                    statuses: StatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                    divisions: DivisionsResolver
                }
            },
            {
                path: ':id',
                component: TargetManagementComponent,
                data: { mode: 'edit' }
            }
        ]
    }
];

import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { RemoveStorageGuard } from 'app/core/auth/guards/remove-storage.guard';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, StatusesResolver, SubBusResolver, TargetTypesResolver, UserResolver } from '../../../shared/resolver';
import { ConfirmationComponent } from '../target-management/components/confirmation/confirmation.component';
import { TargetManagementComponent } from '../target-management/components/target-management/target-management.component';
import { MyTargetListComponent } from './my-target-list/my-target-list.component';
import { MyTargetComponent } from './my-target.component';


export const myTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        canDeactivate: [RemoveStorageGuard],
        component: MyTargetComponent,
        children: [
            {
                path: '',
                component: MyTargetListComponent,
                resolve: {
                    organizes: OrganizesResolver,
                    statuses: StatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    targetTypes: TargetTypesResolver,
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                    divisions: DivisionsResolver
                }
            },
            {
                path: ':id',
                component: TargetManagementComponent,
                data: { mode: 'edit' },
                resolve: {
                    user: UserResolver
                }
            },
            {
                path: ':organizeCode/confirmation',
                component: ConfirmationComponent
            }
        ]
    }
];

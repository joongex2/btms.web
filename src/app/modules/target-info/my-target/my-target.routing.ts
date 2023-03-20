import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { TargetListComponent } from 'app/modules/target-list/target-list.component';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, SubBusResolver, TargetTypesResolver, UserResolver } from '../../../shared/resolver';
import { ConfirmationComponent } from '../target-management/components/confirmation/confirmation.component';
import { TargetManagementComponent } from '../target-management/components/target-management/target-management.component';
import { MyTargetComponent } from './my-target.component';


export const myTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: MyTargetComponent,
        children: [
            {
                path: '',
                component: TargetListComponent,
                resolve: {
                    user: UserResolver,
                    organizes: OrganizesResolver,
                    statuses: DocumentStatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    targetTypes: TargetTypesResolver,
                    bus: BusResolver,
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
                path: ':id/confirm-submit',
                component: ConfirmationComponent,
                data: { mode: 'document-submit' }
            },
            {
                path: ':id/confirm-reject',
                component: ConfirmationComponent,
                data: { mode: 'document-reject' }
            }
        ]
    }
];

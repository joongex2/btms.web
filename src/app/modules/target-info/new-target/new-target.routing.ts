import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { RemoveStorageGuard } from 'app/core/auth/guards/remove-storage.guard';
import { UserResolver } from '../../../shared/resolver';
import { ConfirmationComponent } from '../target-management/components/confirmation/confirmation.component';
import { TargetManagementComponent } from '../target-management/components/target-management/target-management.component';
import { NewTargetListComponent } from './new-target-list/new-target-list.component';
import { NewTargetComponent } from './new-target.component';

export const newTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        canDeactivate: [RemoveStorageGuard],
        component: NewTargetComponent,
        children: [
            {
                path: '',
                component: NewTargetListComponent
            },
            {
                path: ':organizeCode',
                component: TargetManagementComponent,
                data: { mode: 'add' },
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

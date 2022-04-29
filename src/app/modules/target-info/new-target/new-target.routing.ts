import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { UserResolver } from '../../../shared/resolver';
import { TargetManagementComponent } from '../target-management/target-management.component';
import { NewTargetListComponent } from './new-target-list/new-target-list.component';
import { NewTargetComponent } from './new-target.component';

export const newTargetRoutes: Route[] = [
    {
        path     : '',
        canActivate: [MenuGuard],
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
            }
        ]
    }
];

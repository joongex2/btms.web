import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { TargetManagementComponent } from '../target-management/target-management.component';
import { MyTargetListComponent } from './my-target-list/my-target-list.component';
import { MyTargetComponent } from './my-target.component';

export const myTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: MyTargetComponent,
        children: [
            {
                path: '',
                component: MyTargetListComponent
            },
            {
                path: ':id',
                component: TargetManagementComponent,
                data: { mode: 'edit' }
            }
        ]
    }
];

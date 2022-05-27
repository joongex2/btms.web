import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, OrganizesResolver, PlantsResolver, SubBusResolver } from 'app/shared/resolver';
import { AdminUserDetailComponent } from './admin-user-detail/admin-user-detail.component';
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';
import { AdminUserComponent } from './admin-user.component';

export const userRoutes: Route[] = [
    {
        path: '',
        component: AdminUserComponent,
        // canActivate: [MenuGuard],
        children: [
            {
                path: '',
                component: AdminUserListComponent
            },
            {
                path: 'add-user',
                component: AdminUserDetailComponent,
                resolve: {
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                }
            },
            {
                path: ':id',
                component: AdminUserDetailComponent,
                resolve: {
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                }
            }
        ]
    }
];

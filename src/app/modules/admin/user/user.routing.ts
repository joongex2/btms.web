import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OrganizesResolver } from 'app/shared/resolver';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user.component';

export const userRoutes: Route[] = [
    {
        path: '',
        component: UserComponent,
        canActivate: [MenuGuard],
        children: [
            {
                path: '',
                component: UserListComponent,
                resolve: {
                    organizations: OrganizesResolver
                }
            },
            {
                path: 'add-user',
                component: UserDetailComponent
            },
            {
                path: ':id',
                component: UserDetailComponent
            }
        ]
    }
];

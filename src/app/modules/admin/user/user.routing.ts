import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
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
                component: UserListComponent
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

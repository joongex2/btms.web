import { Route } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserComponent } from './user.component';

export const userRoutes: Route[] = [
    {
        path: '',
        component: UserComponent
    },
    {
        path: 'user-detail',
        component: UserDetailComponent
    },
    {
        path: 'user-detail/:id',
        component: UserDetailComponent
    }
];

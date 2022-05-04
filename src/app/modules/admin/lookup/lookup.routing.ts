import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { LookupComponent } from './lookup.component';

export const lookupRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: LookupComponent
    }
];

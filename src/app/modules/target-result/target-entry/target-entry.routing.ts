import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { TargetEntryComponent } from './target-entry.component';

export const targetEntryRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: TargetEntryComponent
    }
];

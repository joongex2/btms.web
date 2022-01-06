import { Route } from '@angular/router';
import { Dashboard1Component } from './dashboard1.component';
import { Dashboard1Resolver } from './dashboard1.resolvers';

export const dashboard1Routes: Route[] = [
    {
        path     : '',
        component: Dashboard1Component,
        resolve  : {
            data: Dashboard1Resolver
        }
    }
];

import { Route } from '@angular/router';
import { TargetManagementComponent } from 'app/modules/target-info/target-management/components/target-management/target-management.component';
import { UserResolver } from '../../../shared/resolver';
import { TargetTemplateDetailComponent } from './target-template-detail/target-template-detail.component';
import { TargetTemplateListComponent } from './target-template-list/target-template-list.component';
import { TargetTemplateComponent } from './target-template.component';


export const targetTemplateRoutes: Route[] = [
    {
        path: '',
        // canActivate: [MenuGuard],
        component: TargetTemplateComponent,
        children: [
            {
                path: '',
                component: TargetTemplateListComponent
            },
            {
                path: 'add-template',
                component: TargetTemplateDetailComponent,
                resolve: {
                    user: UserResolver
                }
            },
            {
                path: ':id',
                component: TargetTemplateDetailComponent
            }
        ]
    }
];

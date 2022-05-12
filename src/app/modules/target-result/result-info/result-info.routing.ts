import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { TargetListComponent } from 'app/modules/target-list/target-list.component';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, StatusesResolver, SubBusResolver, TargetTypesResolver } from 'app/shared/resolver';
import { TargetEntryDetailComponent } from '../target-entry-detail/target-entry-detail.component';
import { TargetSaveComponent } from '../target-save/target-save.component';
import { ResultInfoComponent } from './result-info.component';

export const resultInfoRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: ResultInfoComponent,
        children: [
            {
                path: '',
                component: TargetListComponent,
                resolve: {
                    organizes: OrganizesResolver,
                    statuses: StatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    targetTypes: TargetTypesResolver,
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                    divisions: DivisionsResolver
                }
            },
            {
                path: ':id',
                component: TargetEntryDetailComponent,
                data: { readonly: true }
            },
            {
                path: ':id/save',
                component: TargetSaveComponent,
                data: { readonly: true }
            },
        ]
    }
];

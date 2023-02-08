import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, ReferenceDataResolver, ReferenceStatusesResolver, StatusesResolver, SubBusResolver, TargetTypesResolver } from 'app/shared/resolver';
import { ReferenceListComponent } from '../reference-list/reference-list.component';
import { TargetCauseFixComponent } from '../target-cause-fix/target-cause-fix.component';
import { CauseEditTargetComponent } from './cause-edit-target.component';

export const causeEditTargetRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: CauseEditTargetComponent,
        children: [
            {
                path: '',
                component: ReferenceListComponent,
                resolve: {
                    organizes: OrganizesResolver,
                    statuses: ReferenceStatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    targetTypes: TargetTypesResolver,
                    bus: BusResolver,
                    subBus: SubBusResolver,
                    plants: PlantsResolver,
                    divisions: DivisionsResolver
                }
            },
            {
                path: 'documents/:documentId/references/:referenceId',
                component: TargetCauseFixComponent,
                resolve: {
                    document: DocumentResolver,
                    referenceData: ReferenceDataResolver
                },
                data: { mode: 'edit' }
            }
        ]
    }
];

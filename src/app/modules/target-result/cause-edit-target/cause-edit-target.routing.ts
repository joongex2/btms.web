import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { ConfirmationComponent } from 'app/modules/target-info/target-management/components/confirmation/confirmation.component';
import { BusResolver, DivisionsResolver, DocumentResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, ReferenceDataResolver, ReferenceStatusesResolver, SubBusResolver, TargetTypesResolver, UserResolver } from 'app/shared/resolver';
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
                    user: UserResolver,
                    document: DocumentResolver,
                    referenceData: ReferenceDataResolver
                },
                data: { mode: 'edit' }
            },
            {
                path: 'documents/:documentId/references/:referenceId/confirm-submit',
                component: ConfirmationComponent,
                data: { mode: 'reference-submit' }
            },
            {
                path: 'documents/:documentId/references/:referenceId/confirm-reject',
                component: ConfirmationComponent,
                data: { mode: 'reference-reject' }
            }
        ]
    }
];

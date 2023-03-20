import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { RemoveStorageGuard } from 'app/core/auth/guards/remove-storage.guard';
import { ConfirmationComponent } from 'app/modules/target-info/target-management/components/confirmation/confirmation.component';
import { TargetListComponent } from 'app/modules/target-list/target-list.component';
import { ActualResolver, BusResolver, DivisionsResolver, DocumentResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, ReferenceResolver, DocumentStatusesResolver, SubBusResolver, TargetTypesResolver, UserResolver, TargetActualStatusesResolver } from 'app/shared/resolver';
import { TargetCauseFixComponent } from '../target-cause-fix/target-cause-fix.component';
import { TargetEntryDetailComponent } from '../target-entry-detail/target-entry-detail.component';
import { TargetSaveComponent } from '../target-save/target-save.component';
import { TargetEntryComponent } from './target-entry.component';

export const targetEntryRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        canDeactivate: [RemoveStorageGuard],
        component: TargetEntryComponent,
        children: [
            {
                path: '',
                component: TargetListComponent,
                resolve: {
                    user: UserResolver,
                    organizes: OrganizesResolver,
                    statuses: TargetActualStatusesResolver,
                    documentTypes: DocumentTypesResolver,
                    targetTypes: TargetTypesResolver,
                    bus: BusResolver,
                    divisions: DivisionsResolver
                }
            },
            {
                path: ':id',
                component: TargetEntryDetailComponent,
                resolve: {
                    user: UserResolver
                }
            },
            {
                path: ':id/plans/:planId/month/:month',
                component: TargetSaveComponent,
                resolve: {
                    user: UserResolver,
                    actual: ActualResolver
                }
            },
            {
                path: ':id/confirm-submit',
                component: ConfirmationComponent,
                data: { mode: 'actual-submit' }
            },
            {
                path: ':id/confirm-reject',
                component: ConfirmationComponent,
                data: { mode: 'actual-reject' }
            },
            {
                path: ':documentId/plans/:planId/month/:month/add-cause-and-fix',
                component: TargetCauseFixComponent,
                data: { mode: 'add' },
                resolve: {
                    user: UserResolver,
                    document: DocumentResolver,
                    actual: ActualResolver
                }
            },
            {
                path: ':documentId/plans/:planId/month/:month/cause-and-fix/:referenceId',
                component: TargetCauseFixComponent,
                data: { mode: 'edit' },
                resolve: {
                    user: UserResolver,
                    document: DocumentResolver,
                    actual: ActualResolver,
                    reference: ReferenceResolver
                }
            },
            {
                path: ':documentId/plans/:planId/month/:month/cause-and-fix/:referenceId/confirm-submit',
                component: ConfirmationComponent,
                data: { mode: 'reference-submit' }
            },
            {
                path: ':documentId/plans/:planId/month/:month/cause-and-fix/:referenceId/confirm-reject',
                component: ConfirmationComponent,
                data: { mode: 'reference-reject' }
            }
        ]
    }
];

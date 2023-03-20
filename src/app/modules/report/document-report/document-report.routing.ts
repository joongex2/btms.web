import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, TargetTypesResolver } from 'app/shared/resolver';
import { DocumentReportComponent } from './document-report.component';


export const documentReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: DocumentReportComponent,
        resolve: {
            organizes: OrganizesResolver,
            statuses: DocumentStatusesResolver,
            documentTypes: DocumentTypesResolver,
            targetTypes: TargetTypesResolver,
            bus: BusResolver,
            divisions: DivisionsResolver
        }
    }
];

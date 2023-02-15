import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, StatusesResolver, SubBusResolver, TargetTypesResolver } from 'app/shared/resolver';
import { DocumentReportComponent } from './document-report.component';


export const documentReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: DocumentReportComponent,
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
    }
];

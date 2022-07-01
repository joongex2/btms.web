import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OrganizesResolver, StatusesResolver, DocumentTypesResolver, TargetTypesResolver, BusResolver, SubBusResolver, PlantsResolver, DivisionsResolver } from 'app/shared/resolver';
import { AnnualReportComponent } from './annual-report.component';


export const annualReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: AnnualReportComponent,
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

import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OverviewComponent } from './pages/dashboard/overview/overview.component';
import { CertificatesComponent } from './pages/dashboard/certificates/certificates.component';
import { CertificateDetailsComponent } from './pages/dashboard/certificates/certificate-details/certificate-details.component';
import { DealersComponent } from './pages/dashboard/dealers/dealers.component';
import { PaymentsComponent } from './pages/dashboard/payments/payments.component';
import { InvoicesComponent } from './pages/dashboard/invoices/invoices.component';
import { ReportsComponent } from './pages/dashboard/reports/reports.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'certificates/:id', component: CertificateDetailsComponent },
      { path: 'dealers', component: DealersComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];

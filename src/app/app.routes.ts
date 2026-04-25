import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CertificatesComponent } from './pages/dashboard/certificates/certificates.component';
import { InvoicesComponent } from './pages/dashboard/invoices/invoices.component';
import { PaymentsComponent } from './pages/dashboard/payments/payments.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'certificates', pathMatch: 'full' },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'payments', component: PaymentsComponent },
    ],
  },
];

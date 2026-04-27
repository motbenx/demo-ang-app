import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { CertificatesService } from '../certificates/certificates.service';
import { PaymentsService } from '../payments/payments.service';

interface KpiCard {
  label: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [DecimalPipe, TuiIcon],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  protected readonly totalCertificates = signal<number>(0);
  protected readonly activeCertificates = signal<number>(0);
  protected readonly totalRevenue = signal<number>(0);
  protected readonly pendingPayments = signal<number>(0);

  protected readonly kpiCards = computed<KpiCard[]>(() => [
    {
      label: 'Total Certificates',
      value: this.totalCertificates().toString(),
      trend: '+5%',
      trendPositive: true,
      icon: '@tui.file-badge',
      color: '#6366f1',
    },
    {
      label: 'Active Certificates',
      value: this.activeCertificates().toString(),
      trend: '+5%',
      trendPositive: true,
      icon: '@tui.check-circle',
      color: '#22c55e',
    },
    {
      label: 'Total Revenue',
      value: `€${this.totalRevenue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '-2%',
      trendPositive: false,
      icon: '@tui.trending-up',
      color: '#8b5cf6',
    },
    {
      label: 'Pending Payments',
      value: this.pendingPayments().toString(),
      trend: '-2%',
      trendPositive: false,
      icon: '@tui.clock',
      color: '#f59e0b',
    },
  ]);

  constructor(
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService
  ) {
    this.loadKpiData();
  }

  private loadKpiData(): void {
    const certificates = this.certificatesService.getCertificates();
    this.totalCertificates.set(certificates.length);
    this.activeCertificates.set(certificates.filter(c => c.status === 'active').length);
    
    this.totalRevenue.set(this.paymentsService.getTotalRevenue());
    this.pendingPayments.set(this.paymentsService.getPendingPaymentsCount());
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { CertStatus } from '../certificates/certificates.component';
import { CertificatesService } from '../certificates/certificates.service';
import { PaymentStatus } from '../payments/payments.component';
import { PaymentsService } from '../payments/payments.service';

interface KpiCard {
  label: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  icon: string;
  color: string;
}

interface StatusBreakdown {
  status: CertStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

type ActivityType = 'certificate' | 'payment';

interface ActivityItem {
  type: ActivityType;
  referenceNo: string;
  date: string;
  customer: string;
  status: CertStatus | PaymentStatus;
  amount?: number;
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

  protected readonly statusBreakdown = computed<StatusBreakdown[]>(() => {
    const certificates = this.certificatesService.getCertificates();
    const total = certificates.length;

    const statusCounts: Record<CertStatus, number> = {
      active: 0,
      expired: 0,
      pending: 0,
      suspended: 0,
    };

    certificates.forEach(cert => {
      statusCounts[cert.status]++;
    });

    const statusConfig: Record<CertStatus, { label: string; color: string }> = {
      active: { label: 'Active', color: '#22c55e' },
      expired: { label: 'Expired', color: '#ef4444' },
      pending: { label: 'Pending', color: '#f59e0b' },
      suspended: { label: 'Suspended', color: '#9ca3af' },
    };

    return (Object.keys(statusCounts) as CertStatus[]).map(status => ({
      status,
      label: statusConfig[status].label,
      count: statusCounts[status],
      percentage: total > 0 ? (statusCounts[status] / total) * 100 : 0,
      color: statusConfig[status].color,
    }));
  });

  protected readonly recentActivity = computed<ActivityItem[]>(() => {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();

    const certActivities: ActivityItem[] = certificates
      .slice()
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, 5)
      .map(cert => ({
        type: 'certificate' as ActivityType,
        referenceNo: cert.certNo,
        date: cert.created,
        customer: cert.customer,
        status: cert.status,
        amount: cert.certPrice,
      }));

    const paymentActivities: ActivityItem[] = payments
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(payment => ({
        type: 'payment' as ActivityType,
        referenceNo: payment.id,
        date: payment.date,
        customer: payment.customer,
        status: payment.status,
        amount: payment.amount,
      }));

    return [...certActivities, ...paymentActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  });

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

  protected activityIcon(type: ActivityType): string {
    return type === 'certificate' ? '@tui.file-badge' : '@tui.credit-card';
  }

  protected statusLabel(status: CertStatus | PaymentStatus): string {
    const statusStr = status as string;
    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
  }
}

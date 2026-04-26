import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { Certificate } from '../certificates/certificates.component';
import { CertificatesService } from '../certificates/certificates.service';
import { Payment } from '../payments/payments.component';
import { PaymentService } from '../payments/payment.service';

export interface ActivityItem {
  type: 'certificate' | 'payment';
  id: string;
  date: string;
  customer: string;
  amount: number;
  category: string;
  status: string;
}

export interface CertStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [DecimalPipe, RouterLink, TuiButton, TuiIcon],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  private readonly certificates = signal<Certificate[]>([]);
  private readonly payments = signal<Payment[]>([]);

  protected readonly totalCertificates = computed(() => this.certificates().length);

  protected readonly activeCertificates = computed(() => 
    this.certificates().filter(cert => cert.status === 'active').length
  );

  protected readonly totalRevenue = computed(() => 
    this.payments()
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0)
  );

  protected readonly pendingPayments = computed(() => 
    this.payments()
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0)
  );

  protected readonly certStatusBreakdown = computed(() => {
    const certs = this.certificates();
    const total = certs.length;
    
    const statusCounts: Record<string, number> = {
      active: 0,
      expired: 0,
      pending: 0,
      suspended: 0,
    };

    certs.forEach(cert => {
      statusCounts[cert.status] = (statusCounts[cert.status] || 0) + 1;
    });

    const breakdown: CertStatusBreakdown[] = [
      { status: 'Active', count: statusCounts.active, percentage: (statusCounts.active / total) * 100, color: '#22c55e' },
      { status: 'Pending', count: statusCounts.pending, percentage: (statusCounts.pending / total) * 100, color: '#f59e0b' },
      { status: 'Expired', count: statusCounts.expired, percentage: (statusCounts.expired / total) * 100, color: '#ef4444' },
      { status: 'Suspended', count: statusCounts.suspended, percentage: (statusCounts.suspended / total) * 100, color: '#9ca3af' },
    ];

    return breakdown;
  });

  protected readonly recentActivity = computed(() => {
    const allCerts = [...this.certificates()];
    allCerts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    const last5Certs = allCerts.slice(0, 5);

    const allPayments = [...this.payments()];
    allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const last5Payments = allPayments.slice(0, 5);

    const certItems: ActivityItem[] = last5Certs.map(cert => ({
      type: 'certificate' as const,
      id: cert.certNo,
      date: cert.created,
      customer: cert.customer,
      amount: cert.certPrice,
      category: cert.category,
      status: cert.status,
    }));

    const paymentItems: ActivityItem[] = last5Payments.map(payment => ({
      type: 'payment' as const,
      id: payment.id,
      date: payment.date,
      customer: payment.customer,
      amount: payment.amount,
      category: payment.category,
      status: payment.status,
    }));

    const merged = [...certItems, ...paymentItems];

    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return merged;
  });

  constructor(
    private certificatesService: CertificatesService,
    private paymentService: PaymentService
  ) {
    this.certificates.set(this.certificatesService.getCertificates());
    this.payments.set(this.paymentService.getPayments());
  }

  protected activityIcon(type: 'certificate' | 'payment'): string {
    return type === 'certificate' ? '@tui.file-badge' : '@tui.credit-card';
  }

  protected activityTypeLabel(type: 'certificate' | 'payment'): string {
    return type === 'certificate' ? 'Certificate' : 'Payment';
  }

  protected statusLabel(type: 'certificate' | 'payment', status: string): string {
    if (type === 'certificate') {
      const labels: Record<string, string> = {
        active: 'Active',
        expired: 'Expired',
        pending: 'Pending',
        suspended: 'Suspended',
      };
      return labels[status] || status;
    } else {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }
}

import { Component, computed, signal } from '@angular/core';
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

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
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
}

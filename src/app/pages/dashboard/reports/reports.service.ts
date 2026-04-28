import { Injectable } from '@angular/core';
import { CertificatesService } from '../certificates/certificates.service';
import { Certificate, CertStatus } from '../certificates/certificates.component';
import { PaymentsService } from '../payments/payments.service';
import { Payment, Invoice, PaymentStatus, InvoiceStatus } from '../payments/payments.component';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  certificatesIssued: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  activeCertificates: number;
  suspendedCertificates: number;
  expiredCertificates: number;
  averageCertificateValue: number;
}

export interface SummaryMetrics {
  totalCertificates: number;
  totalActiveCertificates: number;
  totalSuspendedCertificates: number;
  totalExpiredCertificates: number;
  totalRevenue: number;
  totalPaidInvoices: number;
  totalUnpaidInvoices: number;
  totalOverdueInvoices: number;
  averageCertificateValue: number;
  averageMonthlyRevenue: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService
  ) {}

  getMonthlySummaries(dateRange?: DateRange): MonthlySummary[] {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();

    const filteredCertificates = dateRange
      ? this.filterCertificatesByDateRange(certificates, dateRange)
      : certificates;

    const filteredPayments = dateRange
      ? this.filterPaymentsByDateRange(payments, dateRange)
      : payments;

    const monthlyMap = new Map<string, MonthlySummary>();

    filteredCertificates.forEach(cert => {
      const date = new Date(cert.created);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthlyMap.set(monthKey, {
          month: monthNames[date.getMonth()],
          year: date.getFullYear(),
          certificatesIssued: 0,
          totalRevenue: 0,
          paidInvoices: 0,
          unpaidInvoices: 0,
          overdueInvoices: 0,
          activeCertificates: 0,
          suspendedCertificates: 0,
          expiredCertificates: 0,
          averageCertificateValue: 0,
        });
      }

      const summary = monthlyMap.get(monthKey)!;
      summary.certificatesIssued++;

      if (cert.status === 'active') {
        summary.activeCertificates++;
      } else if (cert.status === 'suspended') {
        summary.suspendedCertificates++;
      } else if (cert.status === 'expired') {
        summary.expiredCertificates++;
      }
    });

    filteredPayments.forEach(payment => {
      const date = new Date(payment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyMap.has(monthKey)) {
        const summary = monthlyMap.get(monthKey)!;
        
        if (payment.status === 'completed') {
          summary.totalRevenue += payment.amount;
          summary.paidInvoices++;
        } else if (payment.status === 'pending') {
          summary.unpaidInvoices++;
        } else if (payment.status === 'failed') {
          summary.overdueInvoices++;
        }
      }
    });

    const summaries = Array.from(monthlyMap.values()).map(summary => ({
      ...summary,
      averageCertificateValue: summary.certificatesIssued > 0
        ? summary.totalRevenue / summary.certificatesIssued
        : 0,
    }));

    summaries.sort((a, b) => {
      const dateA = new Date(a.year, this.getMonthIndex(a.month));
      const dateB = new Date(b.year, this.getMonthIndex(b.month));
      return dateA.getTime() - dateB.getTime();
    });

    return summaries;
  }

  getSummaryMetrics(dateRange?: DateRange): SummaryMetrics {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();

    const filteredCertificates = dateRange
      ? this.filterCertificatesByDateRange(certificates, dateRange)
      : certificates;

    const filteredPayments = dateRange
      ? this.filterPaymentsByDateRange(payments, dateRange)
      : payments;

    const totalCertificates = filteredCertificates.length;
    const totalActiveCertificates = filteredCertificates.filter(c => c.status === 'active').length;
    const totalSuspendedCertificates = filteredCertificates.filter(c => c.status === 'suspended').length;
    const totalExpiredCertificates = filteredCertificates.filter(c => c.status === 'expired').length;

    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    const totalPaidInvoices = completedPayments.length;
    const totalUnpaidInvoices = filteredPayments.filter(p => p.status === 'pending').length;
    const totalOverdueInvoices = filteredPayments.filter(p => p.status === 'failed').length;

    const averageCertificateValue = totalCertificates > 0
      ? totalRevenue / totalCertificates
      : 0;

    const monthlySummaries = this.getMonthlySummaries(dateRange);
    const averageMonthlyRevenue = monthlySummaries.length > 0
      ? monthlySummaries.reduce((sum, m) => sum + m.totalRevenue, 0) / monthlySummaries.length
      : 0;

    return {
      totalCertificates,
      totalActiveCertificates,
      totalSuspendedCertificates,
      totalExpiredCertificates,
      totalRevenue,
      totalPaidInvoices,
      totalUnpaidInvoices,
      totalOverdueInvoices,
      averageCertificateValue,
      averageMonthlyRevenue,
    };
  }

  filterByDateRange(dateRange: DateRange): { certificates: Certificate[]; payments: Payment[] } {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();

    return {
      certificates: this.filterCertificatesByDateRange(certificates, dateRange),
      payments: this.filterPaymentsByDateRange(payments, dateRange),
    };
  }

  private filterCertificatesByDateRange(certificates: Certificate[], dateRange: DateRange): Certificate[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    return certificates.filter(cert => {
      const certDate = new Date(cert.created);
      return certDate >= startDate && certDate <= endDate;
    });
  }

  private filterPaymentsByDateRange(payments: Payment[], dateRange: DateRange): Payment[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    return payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  private getMonthIndex(monthName: string): number {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames.indexOf(monthName);
  }
}

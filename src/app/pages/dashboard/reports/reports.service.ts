import { Injectable } from '@angular/core';
import { CertificatesService } from '../certificates/certificates.service';
import { Certificate, CertStatus } from '../certificates/certificates.component';
import { PaymentsService } from '../payments/payments.service';
import { Payment } from '../payments/payments.component';
import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/invoices.component';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  certificatesIssued: number;
  activeCertificates: number;
  suspendedCertificates: number;
  expiredCertificates: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  averageCertificateValue: number;
  averageInvoiceValue: number;
}

export interface SummaryMetrics {
  totalCertificatesIssued: number;
  totalActiveCertificates: number;
  totalSuspendedCertificates: number;
  totalExpiredCertificates: number;
  totalRevenue: number;
  totalPaidInvoices: number;
  totalUnpaidInvoices: number;
  totalOverdueInvoices: number;
  averageCertificateValue: number;
  averageInvoiceValue: number;
  averageMonthlyRevenue: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService,
    private invoicesService: InvoicesService
  ) {}

  getMonthlySummaries(dateRange?: DateRange): MonthlySummary[] {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();
    const invoices = this.invoicesService.getInvoices();

    const filteredCertificates = dateRange
      ? this.filterCertificatesByDateRange(certificates, dateRange)
      : certificates;

    const filteredPayments = dateRange
      ? this.filterPaymentsByDateRange(payments, dateRange)
      : payments;

    const filteredInvoices = dateRange
      ? this.filterInvoicesByDateRange(invoices, dateRange)
      : invoices;

    const monthlyMap = new Map<string, MonthlySummary>();

    filteredCertificates.forEach(cert => {
      const date = new Date(cert.created);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthlyMap.set(monthKey, {
          month: monthNames[date.getMonth()],
          year: date.getFullYear(),
          certificatesIssued: 0,
          activeCertificates: 0,
          suspendedCertificates: 0,
          expiredCertificates: 0,
          totalRevenue: 0,
          paidInvoices: 0,
          unpaidInvoices: 0,
          overdueInvoices: 0,
          averageCertificateValue: 0,
          averageInvoiceValue: 0,
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
      if (payment.status === 'completed') {
        const date = new Date(payment.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (monthlyMap.has(monthKey)) {
          const summary = monthlyMap.get(monthKey)!;
          summary.totalRevenue += payment.amount;
        }
      }
    });

    filteredInvoices.forEach(invoice => {
      const date = new Date(invoice.created);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyMap.has(monthKey)) {
        const summary = monthlyMap.get(monthKey)!;

        if (invoice.status === 'paid') {
          summary.paidInvoices++;
        } else if (invoice.status === 'unpaid') {
          summary.unpaidInvoices++;
        } else if (invoice.status === 'overdue') {
          summary.overdueInvoices++;
        }
      }
    });

    const summaries = Array.from(monthlyMap.values()).map(summary => {
      const totalInvoices = summary.paidInvoices + summary.unpaidInvoices + summary.overdueInvoices;
      return {
        ...summary,
        averageCertificateValue: summary.certificatesIssued > 0
          ? summary.totalRevenue / summary.certificatesIssued
          : 0,
        averageInvoiceValue: totalInvoices > 0
          ? summary.totalRevenue / totalInvoices
          : 0,
      };
    });

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
    const invoices = this.invoicesService.getInvoices();

    const filteredCertificates = dateRange
      ? this.filterCertificatesByDateRange(certificates, dateRange)
      : certificates;

    const filteredPayments = dateRange
      ? this.filterPaymentsByDateRange(payments, dateRange)
      : payments;

    const filteredInvoices = dateRange
      ? this.filterInvoicesByDateRange(invoices, dateRange)
      : invoices;

    const totalCertificatesIssued = filteredCertificates.length;
    const totalActiveCertificates = filteredCertificates.filter(c => c.status === 'active').length;
    const totalSuspendedCertificates = filteredCertificates.filter(c => c.status === 'suspended').length;
    const totalExpiredCertificates = filteredCertificates.filter(c => c.status === 'expired').length;

    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');
    const totalPaidInvoices = paidInvoices.length;
    const totalUnpaidInvoices = filteredInvoices.filter(inv => inv.status === 'unpaid').length;
    const totalOverdueInvoices = filteredInvoices.filter(inv => inv.status === 'overdue').length;

    const totalInvoices = totalPaidInvoices + totalUnpaidInvoices + totalOverdueInvoices;

    const averageCertificateValue = totalCertificatesIssued > 0
      ? totalRevenue / totalCertificatesIssued
      : 0;

    const averageInvoiceValue = totalInvoices > 0
      ? totalRevenue / totalInvoices
      : 0;

    const monthlySummaries = this.getMonthlySummaries(dateRange);
    const averageMonthlyRevenue = monthlySummaries.length > 0
      ? monthlySummaries.reduce((sum, m) => sum + m.totalRevenue, 0) / monthlySummaries.length
      : 0;

    return {
      totalCertificatesIssued,
      totalActiveCertificates,
      totalSuspendedCertificates,
      totalExpiredCertificates,
      totalRevenue,
      totalPaidInvoices,
      totalUnpaidInvoices,
      totalOverdueInvoices,
      averageCertificateValue,
      averageInvoiceValue,
      averageMonthlyRevenue,
    };
  }

  filterByDateRange(dateRange: DateRange): {
    certificates: Certificate[];
    payments: Payment[];
    invoices: Invoice[];
  } {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();
    const invoices = this.invoicesService.getInvoices();

    return {
      certificates: this.filterCertificatesByDateRange(certificates, dateRange),
      payments: this.filterPaymentsByDateRange(payments, dateRange),
      invoices: this.filterInvoicesByDateRange(invoices, dateRange),
    };
  }

  getCertificatesIssuedByMonth(dateRange?: DateRange): { month: string; year: number; count: number }[] {
    const summaries = this.getMonthlySummaries(dateRange);
    return summaries.map(s => ({
      month: s.month,
      year: s.year,
      count: s.certificatesIssued,
    }));
  }

  getRevenueByMonth(dateRange?: DateRange): { month: string; year: number; revenue: number }[] {
    const summaries = this.getMonthlySummaries(dateRange);
    return summaries.map(s => ({
      month: s.month,
      year: s.year,
      revenue: s.totalRevenue,
    }));
  }

  getInvoicePaymentsByMonth(dateRange?: DateRange): {
    month: string;
    year: number;
    paid: number;
    unpaid: number;
    overdue: number;
  }[] {
    const summaries = this.getMonthlySummaries(dateRange);
    return summaries.map(s => ({
      month: s.month,
      year: s.year,
      paid: s.paidInvoices,
      unpaid: s.unpaidInvoices,
      overdue: s.overdueInvoices,
    }));
  }

  private filterCertificatesByDateRange(
    certificates: Certificate[],
    dateRange: DateRange
  ): Certificate[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);

    return certificates.filter(cert => {
      const certDate = new Date(cert.created);
      return certDate >= startDate && certDate <= endDate;
    });
  }

  private filterPaymentsByDateRange(payments: Payment[], dateRange: DateRange): Payment[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);

    return payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  private filterInvoicesByDateRange(invoices: Invoice[], dateRange: DateRange): Invoice[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);

    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    });
  }

  private getMonthIndex(monthName: string): number {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames.indexOf(monthName);
  }
}

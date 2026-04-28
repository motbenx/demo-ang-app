import { Injectable } from '@angular/core';
import { CertificatesService } from '../certificates/certificates.service';
import { PaymentsService } from '../payments/payments.service';
import { InvoicesService } from '../invoices/invoices.service';
import { Certificate } from '../certificates/certificates.component';
import { Payment } from '../payments/payments.component';
import { Invoice } from '../invoices/invoices.component';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ReportSummary {
  totalCertificates: number;
  activeCertificates: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageCertificateValue: number;
}

export interface MonthlyBreakdown {
  month: string;
  year: number;
  certificatesCreated: number;
  totalRevenue: number;
  averageCertificateValue: number;
  paidInvoices: number;
  unpaidInvoices: number;
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

  getReportSummary(dateRange?: DateRange): ReportSummary {
    const certificates = this.filterCertificatesByDateRange(
      this.certificatesService.getCertificates(),
      dateRange
    );
    const payments = this.filterPaymentsByDateRange(
      this.paymentsService.getPayments(),
      dateRange
    );
    const invoices = this.filterInvoicesByDateRange(
      this.invoicesService.getInvoices(),
      dateRange
    );

    const totalCertificates = certificates.length;
    const activeCertificates = certificates.filter(cert => cert.status === 'active').length;
    
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').length;

    const averageCertificateValue = totalCertificates > 0
      ? certificates.reduce((sum, cert) => sum + cert.certPrice, 0) / totalCertificates
      : 0;

    return {
      totalCertificates,
      activeCertificates,
      totalRevenue,
      paidInvoices,
      unpaidInvoices,
      averageCertificateValue,
    };
  }

  getMonthlyBreakdown(dateRange?: DateRange): MonthlyBreakdown[] {
    const certificates = this.filterCertificatesByDateRange(
      this.certificatesService.getCertificates(),
      dateRange
    );
    const payments = this.filterPaymentsByDateRange(
      this.paymentsService.getPayments(),
      dateRange
    );
    const invoices = this.filterInvoicesByDateRange(
      this.invoicesService.getInvoices(),
      dateRange
    );

    const monthlyMap = new Map<string, MonthlyBreakdown>();

    certificates.forEach(cert => {
      const date = new Date(cert.created);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: this.getMonthName(date.getMonth()),
          year: date.getFullYear(),
          certificatesCreated: 0,
          totalRevenue: 0,
          averageCertificateValue: 0,
          paidInvoices: 0,
          unpaidInvoices: 0,
        });
      }

      const entry = monthlyMap.get(key)!;
      entry.certificatesCreated++;
    });

    payments
      .filter(p => p.status === 'completed')
      .forEach(payment => {
        const date = new Date(payment.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyMap.has(key)) {
          const entry = monthlyMap.get(key)!;
          entry.totalRevenue += payment.amount;
        }
      });

    invoices.forEach(invoice => {
      const date = new Date(invoice.created);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: this.getMonthName(date.getMonth()),
          year: date.getFullYear(),
          certificatesCreated: 0,
          totalRevenue: 0,
          averageCertificateValue: 0,
          paidInvoices: 0,
          unpaidInvoices: 0,
        });
      }

      const entry = monthlyMap.get(key)!;
      if (invoice.status === 'paid') {
        entry.paidInvoices++;
      } else if (invoice.status === 'unpaid' || invoice.status === 'overdue') {
        entry.unpaidInvoices++;
      }
    });

    const monthlyData = Array.from(monthlyMap.entries())
      .map(([key, data]) => {
        const certsInMonth = certificates.filter(cert => {
          const date = new Date(cert.created);
          const certKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return certKey === key;
        });

        data.averageCertificateValue = certsInMonth.length > 0
          ? certsInMonth.reduce((sum, cert) => sum + cert.certPrice, 0) / certsInMonth.length
          : 0;

        return data;
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

    return monthlyData;
  }

  private filterCertificatesByDateRange(
    certificates: Certificate[],
    dateRange?: DateRange
  ): Certificate[] {
    if (!dateRange) return certificates;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return certificates.filter(cert => {
      const certDate = new Date(cert.created);
      return certDate >= start && certDate <= end;
    });
  }

  private filterPaymentsByDateRange(
    payments: Payment[],
    dateRange?: DateRange
  ): Payment[] {
    if (!dateRange) return payments;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= start && paymentDate <= end;
    });
  }

  private filterInvoicesByDateRange(
    invoices: Invoice[],
    dateRange?: DateRange
  ): Invoice[] {
    if (!dateRange) return invoices;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created);
      return invoiceDate >= start && invoiceDate <= end;
    });
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  }
}

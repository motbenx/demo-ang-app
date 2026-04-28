import { Injectable, signal } from '@angular/core';
import { Certificate, CertStatus } from '../certificates/certificates.component';
import { CertificatesService } from '../certificates/certificates.service';
import { Invoice, InvoiceStatus, Payment, PaymentStatus } from '../payments/payments.component';
import { PaymentsService } from '../payments/payments.service';

export interface MonthlyBreakdown {
  month: string;
  year: number;
  certificatesIssued: number;
  activeCertificates: number;
  expiredCertificates: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageCertificateValue: number;
}

export interface SummaryMetrics {
  totalCertificatesIssued: number;
  activeCertificates: number;
  expiredCertificates: number;
  pendingCertificates: number;
  suspendedCertificates: number;
  totalRevenue: number;
  totalPaidInvoices: number;
  totalUnpaidInvoices: number;
  totalOverdueInvoices: number;
  averageCertificateValue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilteredResults {
  certificates: Certificate[];
  payments: Payment[];
  invoices: Invoice[];
  summary: SummaryMetrics;
  monthlyBreakdown: MonthlyBreakdown[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService
  ) {}

  getFilteredResults(dateRange: DateRange): FilteredResults {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    const filteredCertificates = this.filterCertificatesByDateRange(startDate, endDate);
    const filteredPayments = this.filterPaymentsByDateRange(startDate, endDate);
    const filteredInvoices = this.filterInvoicesByDateRange(startDate, endDate);

    const summary = this.calculateSummaryMetrics(
      filteredCertificates,
      filteredPayments,
      filteredInvoices
    );

    const monthlyBreakdown = this.calculateMonthlyBreakdown(
      filteredCertificates,
      filteredPayments,
      filteredInvoices,
      startDate,
      endDate
    );

    return {
      certificates: filteredCertificates,
      payments: filteredPayments,
      invoices: filteredInvoices,
      summary,
      monthlyBreakdown,
    };
  }

  getSummaryMetrics(dateRange?: DateRange): SummaryMetrics {
    if (dateRange) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const filteredCertificates = this.filterCertificatesByDateRange(startDate, endDate);
      const filteredPayments = this.filterPaymentsByDateRange(startDate, endDate);
      const filteredInvoices = this.filterInvoicesByDateRange(startDate, endDate);
      return this.calculateSummaryMetrics(filteredCertificates, filteredPayments, filteredInvoices);
    }

    const allCertificates = this.certificatesService.getCertificates();
    const allPayments = this.paymentsService.getPayments();
    const allInvoices = this.getAllInvoices();
    return this.calculateSummaryMetrics(allCertificates, allPayments, allInvoices);
  }

  getMonthlyBreakdown(dateRange: DateRange): MonthlyBreakdown[] {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const filteredCertificates = this.filterCertificatesByDateRange(startDate, endDate);
    const filteredPayments = this.filterPaymentsByDateRange(startDate, endDate);
    const filteredInvoices = this.filterInvoicesByDateRange(startDate, endDate);

    return this.calculateMonthlyBreakdown(
      filteredCertificates,
      filteredPayments,
      filteredInvoices,
      startDate,
      endDate
    );
  }

  private filterCertificatesByDateRange(startDate: Date, endDate: Date): Certificate[] {
    const allCertificates = this.certificatesService.getCertificates();
    return allCertificates.filter(cert => {
      const certDate = new Date(cert.created);
      return certDate >= startDate && certDate <= endDate;
    });
  }

  private filterPaymentsByDateRange(startDate: Date, endDate: Date): Payment[] {
    const allPayments = this.paymentsService.getPayments();
    return allPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  private filterInvoicesByDateRange(startDate: Date, endDate: Date): Invoice[] {
    const allInvoices = this.getAllInvoices();
    return allInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    });
  }

  private calculateSummaryMetrics(
    certificates: Certificate[],
    payments: Payment[],
    invoices: Invoice[]
  ): SummaryMetrics {
    const totalCertificatesIssued = certificates.length;
    const activeCertificates = certificates.filter(c => c.status === 'active').length;
    const expiredCertificates = certificates.filter(c => c.status === 'expired').length;
    const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
    const suspendedCertificates = certificates.filter(c => c.status === 'suspended').length;

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPaidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const totalUnpaidInvoices = invoices.filter(inv => inv.status === 'unpaid').length;
    const totalOverdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

    const totalCertificateValue = certificates.reduce((sum, cert) => sum + cert.certPrice, 0);
    const averageCertificateValue =
      totalCertificatesIssued > 0 ? totalCertificateValue / totalCertificatesIssued : 0;

    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const refundedPayments = payments.filter(p => p.status === 'refunded').length;

    return {
      totalCertificatesIssued,
      activeCertificates,
      expiredCertificates,
      pendingCertificates,
      suspendedCertificates,
      totalRevenue,
      totalPaidInvoices,
      totalUnpaidInvoices,
      totalOverdueInvoices,
      averageCertificateValue,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
    };
  }

  private calculateMonthlyBreakdown(
    certificates: Certificate[],
    payments: Payment[],
    invoices: Invoice[],
    startDate: Date,
    endDate: Date
  ): MonthlyBreakdown[] {
    const monthlyData = new Map<string, MonthlyBreakdown>();

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

      monthlyData.set(monthKey, {
        month: monthName,
        year: currentDate.getFullYear(),
        certificatesIssued: 0,
        activeCertificates: 0,
        expiredCertificates: 0,
        totalRevenue: 0,
        paidInvoices: 0,
        unpaidInvoices: 0,
        averageCertificateValue: 0,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    certificates.forEach(cert => {
      const certDate = new Date(cert.created);
      const monthKey = `${certDate.getFullYear()}-${String(certDate.getMonth() + 1).padStart(2, '0')}`;
      const monthData = monthlyData.get(monthKey);

      if (monthData) {
        monthData.certificatesIssued++;
        if (cert.status === 'active') {
          monthData.activeCertificates++;
        }
        if (cert.status === 'expired') {
          monthData.expiredCertificates++;
        }
      }
    });

    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const paymentDate = new Date(payment.date);
        const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        const monthData = monthlyData.get(monthKey);

        if (monthData) {
          monthData.totalRevenue += payment.amount;
        }
      }
    });

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.created);
      const monthKey = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`;
      const monthData = monthlyData.get(monthKey);

      if (monthData) {
        if (invoice.status === 'paid') {
          monthData.paidInvoices++;
        }
        if (invoice.status === 'unpaid' || invoice.status === 'overdue') {
          monthData.unpaidInvoices++;
        }
      }
    });

    const breakdown = Array.from(monthlyData.values());

    breakdown.forEach(month => {
      if (month.certificatesIssued > 0) {
        const monthlyCerts = certificates.filter(cert => {
          const certDate = new Date(cert.created);
          const certMonthKey = `${certDate.getFullYear()}-${String(certDate.getMonth() + 1).padStart(2, '0')}`;
          const monthKey = `${month.year}-${String(this.getMonthNumber(month.month)).padStart(2, '0')}`;
          return certMonthKey === monthKey;
        });

        const totalValue = monthlyCerts.reduce((sum, cert) => sum + cert.certPrice, 0);
        month.averageCertificateValue = totalValue / month.certificatesIssued;
      }
    });

    return breakdown;
  }

  private getMonthNumber(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName) + 1;
  }

  private getAllInvoices(): Invoice[] {
    return [
      { invoiceNo: 'INV-2025-0041', certNo: 'LTU04000101', created: '2025-01-08', dueDate: '2025-02-08', customer: 'Jonas Petraitis', dealer: 'TechShop Vilnius',  category: 'Smartphones', amount: 89.00,  status: 'paid' },
      { invoiceNo: 'INV-2025-0042', certNo: 'LTU04000102', created: '2025-01-15', dueDate: '2025-02-15', customer: 'Marta Kowalski',  dealer: 'SmartCity Kaunas', category: 'Laptops',     amount: 249.00, status: 'paid' },
      { invoiceNo: 'INV-2025-0043', certNo: 'LTU04000103', created: '2025-02-03', dueDate: '2025-03-03', customer: 'Erik Jansen',     dealer: 'DigitalHub Riga',  category: 'E-Scooters',  amount: 59.00,  status: 'paid' },
      { invoiceNo: 'INV-2025-0044', certNo: 'LTU04000104', created: '2025-02-20', dueDate: '2025-03-20', customer: 'Aino Virtanen',   dealer: 'ElecZone Tallinn', category: 'Tablets',     amount: 129.00, status: 'overdue' },
      { invoiceNo: 'INV-2025-0045', certNo: 'LTU04000105', created: '2025-03-05', dueDate: '2025-04-05', customer: 'Lukas Bauer',     dealer: 'TechShop Vilnius', category: 'Laptops',     amount: 279.00, status: 'paid' },
      { invoiceNo: 'INV-2025-0046', certNo: 'LTU04000106', created: '2025-03-18', dueDate: '2025-04-18', customer: 'Ieva Klimaite',   dealer: 'SmartCity Kaunas', category: 'Smartphones', amount: 99.00,  status: 'unpaid' },
      { invoiceNo: 'INV-2025-0047', certNo: 'LTU04000107', created: '2025-03-29', dueDate: '2025-04-29', customer: 'Pavel Novak',     dealer: 'DigitalHub Riga',  category: 'E-Scooters',  amount: 59.00,  status: 'unpaid' },
      { invoiceNo: 'INV-2025-0048', certNo: 'LTU04000108', created: '2025-04-02', dueDate: '2025-05-02', customer: 'Sigrid Olsen',    dealer: 'ElecZone Tallinn', category: 'Audio',       amount: 69.00,  status: 'draft' },
      { invoiceNo: 'INV-2025-0049', certNo: 'LTU04000109', created: '2025-04-10', dueDate: '2025-05-10', customer: 'Tomas Miklas',    dealer: 'TechShop Vilnius', category: 'Laptops',     amount: 349.00, status: 'paid' },
      { invoiceNo: 'INV-2025-0050', certNo: 'LTU04000110', created: '2025-04-15', dueDate: '2025-05-15', customer: 'Rasa Daugela',    dealer: 'SmartCity Kaunas', category: 'Smartphones', amount: 49.00,  status: 'draft' },
    ];
  }
}

import { Injectable, signal } from '@angular/core';
import { Certificate, CertStatus } from '../certificates/certificates.component';
import { CertificatesService } from '../certificates/certificates.service';
import { Payment, PaymentStatus } from '../payments/payments.component';
import { PaymentsService } from '../payments/payments.service';

export interface Invoice {
  invoiceNo: string;
  certNo: string;
  created: string;
  dueDate: string;
  customer: string;
  dealer: string;
  category: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'draft';
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface MonthlyAggregation {
  month: string;
  certificatesIssued: number;
  activeCertificates: number;
  revenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageCertificateValue: number;
  averageInvoiceValue: number;
}

export interface ReportSummary {
  totalCertificatesIssued: number;
  activeCertificatesCount: number;
  totalRevenue: number;
  paidInvoicesCount: number;
  unpaidInvoicesCount: number;
  averageCertificateValue: number;
  averageInvoiceValue: number;
  totalInvoiceAmount: number;
  paidInvoiceAmount: number;
  unpaidInvoiceAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly invoices = signal<Invoice[]>([
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
  ]);

  constructor(
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService
  ) {}

  getCertificates(filter?: DateRangeFilter): Certificate[] {
    const certificates = this.certificatesService.getCertificates();
    if (!filter) {
      return certificates;
    }
    return this.filterByDateRange(certificates, filter, cert => cert.created);
  }

  getPayments(filter?: DateRangeFilter): Payment[] {
    const payments = this.paymentsService.getPayments();
    if (!filter) {
      return payments;
    }
    return this.filterByDateRange(payments, filter, payment => payment.date);
  }

  getInvoices(filter?: DateRangeFilter): Invoice[] {
    const invoices = this.invoices();
    if (!filter) {
      return invoices;
    }
    return this.filterByDateRange(invoices, filter, invoice => invoice.created);
  }

  getReportSummary(filter?: DateRangeFilter): ReportSummary {
    const certificates = this.getCertificates(filter);
    const payments = this.getPayments(filter);
    const invoices = this.getInvoices(filter);

    const activeCertificates = certificates.filter(cert => cert.status === 'active');
    const completedPayments = payments.filter(payment => payment.status === 'completed');
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue');

    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoiceAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const unpaidInvoiceAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const averageCertificateValue = certificates.length > 0
      ? certificates.reduce((sum, cert) => sum + cert.certPrice, 0) / certificates.length
      : 0;

    const averageInvoiceValue = invoices.length > 0
      ? totalInvoiceAmount / invoices.length
      : 0;

    return {
      totalCertificatesIssued: certificates.length,
      activeCertificatesCount: activeCertificates.length,
      totalRevenue,
      paidInvoicesCount: paidInvoices.length,
      unpaidInvoicesCount: unpaidInvoices.length,
      averageCertificateValue,
      averageInvoiceValue,
      totalInvoiceAmount,
      paidInvoiceAmount,
      unpaidInvoiceAmount,
    };
  }

  getMonthlyAggregations(filter?: DateRangeFilter): MonthlyAggregation[] {
    const certificates = this.getCertificates(filter);
    const payments = this.getPayments(filter);
    const invoices = this.getInvoices(filter);

    const monthMap = new Map<string, {
      certificates: Certificate[];
      payments: Payment[];
      invoices: Invoice[];
    }>();

    certificates.forEach(cert => {
      const month = this.getMonthKey(cert.created);
      if (!monthMap.has(month)) {
        monthMap.set(month, { certificates: [], payments: [], invoices: [] });
      }
      monthMap.get(month)!.certificates.push(cert);
    });

    payments.forEach(payment => {
      const month = this.getMonthKey(payment.date);
      if (!monthMap.has(month)) {
        monthMap.set(month, { certificates: [], payments: [], invoices: [] });
      }
      monthMap.get(month)!.payments.push(payment);
    });

    invoices.forEach(invoice => {
      const month = this.getMonthKey(invoice.created);
      if (!monthMap.has(month)) {
        monthMap.set(month, { certificates: [], payments: [], invoices: [] });
      }
      monthMap.get(month)!.invoices.push(invoice);
    });

    const aggregations: MonthlyAggregation[] = [];

    monthMap.forEach((data, month) => {
      const activeCerts = data.certificates.filter(cert => cert.status === 'active');
      const completedPayments = data.payments.filter(p => p.status === 'completed');
      const paidInvs = data.invoices.filter(inv => inv.status === 'paid');
      const unpaidInvs = data.invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue');

      const revenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

      const avgCertValue = data.certificates.length > 0
        ? data.certificates.reduce((sum, cert) => sum + cert.certPrice, 0) / data.certificates.length
        : 0;

      const avgInvValue = data.invoices.length > 0
        ? data.invoices.reduce((sum, inv) => sum + inv.amount, 0) / data.invoices.length
        : 0;

      aggregations.push({
        month,
        certificatesIssued: data.certificates.length,
        activeCertificates: activeCerts.length,
        revenue,
        paidInvoices: paidInvs.length,
        unpaidInvoices: unpaidInvs.length,
        averageCertificateValue: avgCertValue,
        averageInvoiceValue: avgInvValue,
      });
    });

    return aggregations.sort((a, b) => a.month.localeCompare(b.month));
  }

  getCertificatesByStatus(filter?: DateRangeFilter): Record<CertStatus, number> {
    const certificates = this.getCertificates(filter);
    const statusCounts: Record<CertStatus, number> = {
      active: 0,
      expired: 0,
      pending: 0,
      suspended: 0,
    };

    certificates.forEach(cert => {
      statusCounts[cert.status]++;
    });

    return statusCounts;
  }

  getPaymentsByStatus(filter?: DateRangeFilter): Record<PaymentStatus, number> {
    const payments = this.getPayments(filter);
    const statusCounts: Record<PaymentStatus, number> = {
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    };

    payments.forEach(payment => {
      statusCounts[payment.status]++;
    });

    return statusCounts;
  }

  getRevenueByCategory(filter?: DateRangeFilter): Record<string, number> {
    const payments = this.getPayments(filter).filter(p => p.status === 'completed');
    const categoryRevenue: Record<string, number> = {};

    payments.forEach(payment => {
      if (!categoryRevenue[payment.category]) {
        categoryRevenue[payment.category] = 0;
      }
      categoryRevenue[payment.category] += payment.amount;
    });

    return categoryRevenue;
  }

  getRevenueByDealer(filter?: DateRangeFilter): Record<string, number> {
    const payments = this.getPayments(filter).filter(p => p.status === 'completed');
    const dealerRevenue: Record<string, number> = {};

    payments.forEach(payment => {
      if (!dealerRevenue[payment.dealer]) {
        dealerRevenue[payment.dealer] = 0;
      }
      dealerRevenue[payment.dealer] += payment.amount;
    });

    return dealerRevenue;
  }

  private filterByDateRange<T>(
    items: T[],
    filter: DateRangeFilter,
    dateExtractor: (item: T) => string
  ): T[] {
    const startDate = new Date(filter.startDate);
    const endDate = new Date(filter.endDate);

    return items.filter(item => {
      const itemDate = new Date(dateExtractor(item));
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  private getMonthKey(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

import { Injectable, signal } from '@angular/core';
import { Invoice, InvoiceStatus } from '../payments/payments.component';

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface MonthlyBreakdown {
  month: string;
  certificates: number;
  revenue: number;
  paidInvoices: number;
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

  getInvoices(filter?: DateRangeFilter): Invoice[] {
    let result = this.invoices();
    
    if (filter?.startDate) {
      result = result.filter(inv => inv.created >= filter.startDate!);
    }
    
    if (filter?.endDate) {
      result = result.filter(inv => inv.created <= filter.endDate!);
    }
    
    return result;
  }

  getTotalRevenue(filter?: DateRangeFilter): number {
    return this.getInvoices(filter)
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  getPaidInvoicesCount(filter?: DateRangeFilter): number {
    return this.getInvoices(filter).filter(inv => inv.status === 'paid').length;
  }

  getUnpaidInvoicesCount(filter?: DateRangeFilter): number {
    return this.getInvoices(filter).filter(inv => inv.status === 'unpaid').length;
  }

  getOverdueInvoicesCount(filter?: DateRangeFilter): number {
    return this.getInvoices(filter).filter(inv => inv.status === 'overdue').length;
  }

  getMonthlyBreakdown(filter?: DateRangeFilter): MonthlyBreakdown[] {
    const invoices = this.getInvoices(filter);
    const monthMap = new Map<string, MonthlyBreakdown>();

    invoices.forEach(inv => {
      const month = inv.created.substring(0, 7);
      
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          month,
          certificates: 0,
          revenue: 0,
          paidInvoices: 0,
        });
      }

      const breakdown = monthMap.get(month)!;
      breakdown.certificates++;
      
      if (inv.status === 'paid') {
        breakdown.revenue += inv.amount;
        breakdown.paidInvoices++;
      }
    });

    return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'draft';

export interface Payment {
  id: string;
  certNo: string;
  customer: string;
  dealer: string;
  category: string;
  amount: number;
  method: string;
  date: string;
  status: PaymentStatus;
}

export interface Invoice {
  invoiceNo: string;
  certNo: string;
  created: string;
  dueDate: string;
  customer: string;
  dealer: string;
  category: string;
  amount: number;
  status: InvoiceStatus;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [DecimalPipe, RouterLink, TuiButton, TuiIcon, TuiTabs],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  protected readonly activeTab = signal(0);
  protected readonly tabs = ['Payments', 'Invoices'];

  protected readonly paymentStats = signal([
    { label: 'Total Revenue',  value: '€48,320', icon: '@tui.trending-up',  color: '#6366f1' },
    { label: 'This Month',     value: '€9,150',  icon: '@tui.calendar',     color: '#22c55e' },
    { label: 'Pending',        value: '€2,340',  icon: '@tui.clock',        color: '#f59e0b' },
    { label: 'Refunded',       value: '€610',    icon: '@tui.rotate-ccw',   color: '#ef4444' },
  ]);

  protected readonly invoiceStats = signal([
    { label: 'Total Invoiced', value: '€31,480', icon: '@tui.receipt',      color: '#6366f1' },
    { label: 'Paid',           value: '€24,650', icon: '@tui.check-circle', color: '#22c55e' },
    { label: 'Unpaid',         value: '€4,890',  icon: '@tui.clock',        color: '#f59e0b' },
    { label: 'Overdue',        value: '€1,940',  icon: '@tui.alert-circle', color: '#ef4444' },
  ]);

  protected readonly stats = computed(() => 
    this.activeTab() === 0 ? this.paymentStats() : this.invoiceStats()
  );

  protected readonly payments = signal<Payment[]>([
    {
      id: 'PAY-0001',
      certNo: 'LTU04000101',
      customer: 'Jonas Petraitis',
      dealer: 'TechShop Vilnius',
      category: 'Smartphones',
      amount: 89.00,
      method: 'Card',
      date: '2025-01-08',
      status: 'completed',
    },
    {
      id: 'PAY-0002',
      certNo: 'LTU04000102',
      customer: 'Marta Kowalski',
      dealer: 'SmartCity Kaunas',
      category: 'Laptops',
      amount: 249.00,
      method: 'Bank Transfer',
      date: '2025-01-15',
      status: 'completed',
    },
    {
      id: 'PAY-0003',
      certNo: 'LTU04000103',
      customer: 'Erik Jansen',
      dealer: 'DigitalHub Riga',
      category: 'E-Scooters',
      amount: 59.00,
      method: 'Card',
      date: '2025-02-03',
      status: 'completed',
    },
    {
      id: 'PAY-0004',
      certNo: 'LTU04000104',
      customer: 'Aino Virtanen',
      dealer: 'ElecZone Tallinn',
      category: 'Tablets',
      amount: 129.00,
      method: 'Card',
      date: '2025-02-20',
      status: 'pending',
    },
    {
      id: 'PAY-0005',
      certNo: 'LTU04000105',
      customer: 'Lukas Bauer',
      dealer: 'TechShop Vilnius',
      category: 'Laptops',
      amount: 279.00,
      method: 'Bank Transfer',
      date: '2025-03-05',
      status: 'completed',
    },
    {
      id: 'PAY-0006',
      certNo: 'LTU04000106',
      customer: 'Ieva Klimaite',
      dealer: 'SmartCity Kaunas',
      category: 'Smartphones',
      amount: 99.00,
      method: 'Card',
      date: '2025-03-18',
      status: 'completed',
    },
    {
      id: 'PAY-0007',
      certNo: 'LTU04000107',
      customer: 'Pavel Novak',
      dealer: 'DigitalHub Riga',
      category: 'E-Scooters',
      amount: 59.00,
      method: 'Card',
      date: '2025-03-29',
      status: 'failed',
    },
    {
      id: 'PAY-0008',
      certNo: 'LTU04000108',
      customer: 'Sigrid Olsen',
      dealer: 'ElecZone Tallinn',
      category: 'Audio',
      amount: 69.00,
      method: 'Bank Transfer',
      date: '2025-04-02',
      status: 'refunded',
    },
    {
      id: 'PAY-0009',
      certNo: 'LTU04000109',
      customer: 'Tomas Miklas',
      dealer: 'TechShop Vilnius',
      category: 'Laptops',
      amount: 349.00,
      method: 'Card',
      date: '2025-04-10',
      status: 'completed',
    },
  ]);

  protected readonly invoices = signal<Invoice[]>([
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

  protected paymentStatusLabel(status: PaymentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  protected invoiceStatusLabel(status: InvoiceStatus): string {
    const labels: Record<InvoiceStatus, string> = {
      paid: 'Paid', unpaid: 'Unpaid', overdue: 'Overdue', draft: 'Draft',
    };
    return labels[status];
  }

  protected methodIcon(method: string): string {
    return method === 'Card' ? '@tui.credit-card' : '@tui.building-bank';
  }
}

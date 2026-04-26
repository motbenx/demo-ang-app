import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

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

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [DecimalPipe, RouterLink, TuiButton, TuiIcon],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  protected readonly stats = signal([
    { label: 'Total Revenue',  value: '€48,320', icon: '@tui.trending-up',  color: '#6366f1' },
    { label: 'This Month',     value: '€9,150',  icon: '@tui.calendar',     color: '#22c55e' },
    { label: 'Pending',        value: '€2,340',  icon: '@tui.clock',        color: '#f59e0b' },
    { label: 'Refunded',       value: '€610',    icon: '@tui.rotate-ccw',   color: '#ef4444' },
  ]);

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

  protected statusLabel(status: PaymentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  protected methodIcon(method: string): string {
    return method === 'Card' ? '@tui.credit-card' : '@tui.building-bank';
  }
}

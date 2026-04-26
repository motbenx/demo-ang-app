import { Injectable, signal } from '@angular/core';
import { Invoice, Payment } from './payments.component';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly payments = signal<Payment[]>([
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

  getPayments(): Payment[] {
    return this.payments();
  }

  getInvoices(): Invoice[] {
    return this.invoices();
  }

  getPaymentById(id: string): Payment | undefined {
    return this.payments().find(payment => payment.id === id);
  }

  getInvoiceById(invoiceNo: string): Invoice | undefined {
    return this.invoices().find(invoice => invoice.invoiceNo === invoiceNo);
  }
}

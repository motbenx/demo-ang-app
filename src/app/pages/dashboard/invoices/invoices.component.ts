import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { InvoicesService } from './invoices.service';

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'draft';

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
  selector: 'app-invoices',
  standalone: true,
  imports: [DecimalPipe, RouterLink, TuiButton, TuiIcon],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent {
  protected readonly stats = signal([
    { label: 'Total Invoiced', value: '€31,480', icon: '@tui.receipt',      color: '#6366f1' },
    { label: 'Paid',           value: '€24,650', icon: '@tui.check-circle', color: '#22c55e' },
    { label: 'Unpaid',         value: '€4,890',  icon: '@tui.clock',        color: '#f59e0b' },
    { label: 'Overdue',        value: '€1,940',  icon: '@tui.alert-circle', color: '#ef4444' },
  ]);

  protected readonly invoices = signal<Invoice[]>([]);

  constructor(private invoicesService: InvoicesService) {
    this.invoices.set(this.invoicesService.getInvoices());
  }

  protected statusLabel(status: InvoiceStatus): string {
    const labels: Record<InvoiceStatus, string> = {
      paid: 'Paid', unpaid: 'Unpaid', overdue: 'Overdue', draft: 'Draft',
    };
    return labels[status];
  }
}

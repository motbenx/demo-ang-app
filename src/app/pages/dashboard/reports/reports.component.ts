import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { DateRange, ReportsService, SummaryMetrics } from './reports.service';

interface MetricCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [DecimalPipe, FormsModule, TuiButton, TuiIcon, TuiTextfield],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected startDate = '';
  protected endDate = '';
  protected readonly summaryMetrics = signal<SummaryMetrics | null>(null);

  protected readonly metricCards = computed<MetricCard[]>(() => {
    const metrics = this.summaryMetrics();
    if (!metrics) {
      return [];
    }

    return [
      {
        label: 'Certificates Issued',
        value: metrics.totalCertificatesIssued.toString(),
        icon: '@tui.file-badge',
        color: '#6366f1',
      },
      {
        label: 'Active Certificates',
        value: metrics.activeCertificates.toString(),
        icon: '@tui.check-circle',
        color: '#22c55e',
      },
      {
        label: 'Total Revenue',
        value: `€${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: '@tui.trending-up',
        color: '#8b5cf6',
      },
      {
        label: 'Paid Invoices',
        value: metrics.totalPaidInvoices.toString(),
        icon: '@tui.check-circle',
        color: '#22c55e',
      },
      {
        label: 'Unpaid Invoices',
        value: metrics.totalUnpaidInvoices.toString(),
        icon: '@tui.clock',
        color: '#f59e0b',
      },
      {
        label: 'Average Value',
        value: `€${metrics.averageCertificateValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: '@tui.bar-chart',
        color: '#6366f1',
      },
    ];
  });

  constructor(private reportsService: ReportsService) {
    this.initializeDateRange();
    this.loadData();
  }

  private initializeDateRange(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected onApplyFilter(): void {
    this.loadData();
  }

  protected onResetFilter(): void {
    this.initializeDateRange();
    this.loadData();
  }

  private loadData(): void {
    const dateRange: DateRange = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    const metrics = this.reportsService.getSummaryMetrics(dateRange);
    this.summaryMetrics.set(metrics);
  }
}

import { Component, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputDateRange } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Report, ReportsService } from './reports.service';
import { CertificatesService } from '../certificates/certificates.service';
import { PaymentsService } from '../payments/payments.service';

export type ReportType = 'sales' | 'certificates' | 'payments' | 'dealers';
export type ReportStatus = 'ready' | 'pending' | 'failed';

interface KpiCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, TuiButton, TuiIcon, TuiInputDateRange],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly reports = signal<Report[]>([]);
  protected readonly filteredReports = signal<Report[]>([]);
  protected dateRange = signal<TuiDayRange | null>(null);
  protected typeFilter = signal<string>('all');
  protected statusFilter = signal<string>('all');

  protected readonly typeOptions = ['all', 'sales', 'certificates', 'payments', 'dealers'];
  protected readonly statusOptions = ['all', 'ready', 'pending', 'failed'];

  protected readonly kpiCards = computed<KpiCard[]>(() => {
    const totalCertificates = this.certificatesService.getCertificates().length;
    const totalRevenue = this.paymentsService.getTotalRevenue();
    const certificates = this.certificatesService.getCertificates();
    
    const monthlyRevenues: number[] = [];
    const monthsMap = new Map<string, number>();
    
    certificates.forEach(cert => {
      const date = new Date(cert.created);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const current = monthsMap.get(monthKey) || 0;
      monthsMap.set(monthKey, current + cert.certPrice);
    });
    
    monthsMap.forEach(value => monthlyRevenues.push(value));
    const avgMonthlyRevenue = monthlyRevenues.length > 0 
      ? monthlyRevenues.reduce((sum, val) => sum + val, 0) / monthlyRevenues.length 
      : 0;
    
    const paidInvoicesCount = this.getPaidInvoicesCount();

    return [
      {
        label: 'Total Certificates',
        value: totalCertificates.toString(),
        icon: '@tui.file-badge',
        color: '#6366f1',
      },
      {
        label: 'Total Revenue',
        value: `€${totalRevenue.toFixed(2)}`,
        icon: '@tui.trending-up',
        color: '#22c55e',
      },
      {
        label: 'Avg Monthly Revenue',
        value: `€${avgMonthlyRevenue.toFixed(2)}`,
        icon: '@tui.bar-chart-2',
        color: '#8b5cf6',
      },
      {
        label: 'Paid Invoices',
        value: paidInvoicesCount.toString(),
        icon: '@tui.check-circle',
        color: '#f59e0b',
      },
    ];
  });

  constructor(
    private reportsService: ReportsService,
    private certificatesService: CertificatesService,
    private paymentsService: PaymentsService
  ) {
    this.reports.set(this.reportsService.getReports());
    this.filteredReports.set(this.reports());
  }

  protected applyFilters(): void {
    let result = this.reports();

    const range = this.dateRange();
    if (range && range.from && range.to) {
      result = result.filter(report => {
        const reportDate = this.parseDate(report.generatedDate);
        const fromDate = this.tuiDayToDate(range.from);
        const toDate = this.tuiDayToDate(range.to);
        return reportDate >= fromDate && reportDate <= toDate;
      });
    }

    if (this.typeFilter() !== 'all') {
      result = result.filter(r => r.type === this.typeFilter());
    }

    if (this.statusFilter() !== 'all') {
      result = result.filter(r => r.status === this.statusFilter());
    }

    this.filteredReports.set(result);
  }

  protected clearFilters(): void {
    this.dateRange.set(null);
    this.typeFilter.set('all');
    this.statusFilter.set('all');
    this.filteredReports.set(this.reports());
  }

  protected onDateRangeChange(range: TuiDayRange | null): void {
    this.dateRange.set(range);
    this.applyFilters();
  }

  protected typeLabel(type: string): string {
    const labels: Record<string, string> = {
      sales: 'Sales',
      certificates: 'Certificates',
      payments: 'Payments',
      dealers: 'Dealers',
    };
    return labels[type] ?? type;
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      ready: 'Ready',
      pending: 'Pending',
      failed: 'Failed',
    };
    return labels[status] ?? status;
  }

  private parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  private tuiDayToDate(day: TuiDay): Date {
    return new Date(day.year, day.month, day.day);
  }

  private getPaidInvoicesCount(): number {
    const payments = this.paymentsService.getPayments();
    return payments.filter(p => p.status === 'completed').length;
  }
}

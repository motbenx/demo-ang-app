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

interface MonthlyBreakdown {
  month: string;
  certificates: number;
  revenue: number;
  paidInvoices: number;
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
  protected dateRange: TuiDayRange | null = null;
  protected typeFilter = 'all';
  protected statusFilter = 'all';

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

  protected readonly monthlyBreakdown = computed<MonthlyBreakdown[]>(() => {
    const certificates = this.certificatesService.getCertificates();
    const payments = this.paymentsService.getPayments();
    
    const monthsMap = new Map<string, MonthlyBreakdown>();
    
    certificates.forEach(cert => {
      const date = new Date(cert.created);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, {
          month: monthKey,
          certificates: 0,
          revenue: 0,
          paidInvoices: 0,
        });
      }
      
      const breakdown = monthsMap.get(monthKey)!;
      breakdown.certificates++;
    });
    
    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const date = new Date(payment.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthsMap.has(monthKey)) {
          monthsMap.set(monthKey, {
            month: monthKey,
            certificates: 0,
            revenue: 0,
            paidInvoices: 0,
          });
        }
        
        const breakdown = monthsMap.get(monthKey)!;
        breakdown.revenue += payment.amount;
        breakdown.paidInvoices++;
      }
    });
    
    return Array.from(monthsMap.values()).sort((a, b) => a.month.localeCompare(b.month));
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

    const range = this.dateRange;
    if (range && range.from && range.to) {
      result = result.filter(report => {
        const reportDate = this.parseDate(report.generatedDate);
        const fromDate = this.tuiDayToDate(range.from);
        const toDate = this.tuiDayToDate(range.to);
        return reportDate >= fromDate && reportDate <= toDate;
      });
    }

    if (this.typeFilter !== 'all') {
      result = result.filter(r => r.type === this.typeFilter);
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(r => r.status === this.statusFilter);
    }

    this.filteredReports.set(result);
  }

  protected clearFilters(): void {
    this.dateRange = null;
    this.typeFilter = 'all';
    this.statusFilter = 'all';
    this.filteredReports.set(this.reports());
  }

  protected onDateRangeChange(): void {
    this.applyFilters();
  }

  protected onExportCSV(): void {
    const breakdown = this.monthlyBreakdown();
    
    const headers = ['Month', 'Certificates', 'Revenue (€)', 'Paid Invoices'];
    const rows = breakdown.map(item => [
      item.month,
      item.certificates.toString(),
      item.revenue.toFixed(2),
      item.paidInvoices.toString(),
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

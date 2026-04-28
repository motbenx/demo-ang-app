import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputDateRange } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Report, ReportsService } from './reports.service';

export type ReportType = 'sales' | 'certificates' | 'payments' | 'dealers';
export type ReportStatus = 'ready' | 'pending' | 'failed';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiIcon, TuiInputDateRange],
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

  constructor(private reportsService: ReportsService) {
    this.reports.set(this.reportsService.getReports());
    this.filteredReports.set(this.reports());
  }

  protected applyFilters(): void {
    let result = this.reports();

    // Filter by date range
    const range = this.dateRange();
    if (range && range.from && range.to) {
      result = result.filter(report => {
        const reportDate = this.parseDate(report.generatedDate);
        const fromDate = this.tuiDayToDate(range.from);
        const toDate = this.tuiDayToDate(range.to);
        return reportDate >= fromDate && reportDate <= toDate;
      });
    }

    // Filter by type
    if (this.typeFilter() !== 'all') {
      result = result.filter(r => r.type === this.typeFilter());
    }

    // Filter by status
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
}

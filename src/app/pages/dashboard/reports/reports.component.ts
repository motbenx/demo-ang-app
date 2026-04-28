import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputDateRange, TuiSkeleton } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Report, ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiIcon, TuiSkeleton, TuiInputDateRange],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  protected readonly isLoading = signal(true);
  protected readonly allReports = signal<Report[]>([]);
  protected readonly dateRange = signal<TuiDayRange | null>(null);

  protected readonly filteredReports = computed(() => {
    const reports = this.allReports();
    const range = this.dateRange();

    if (!range || !range.from) {
      return reports;
    }

    return reports.filter(report => {
      const reportDate = this.parseDate(report.generatedDate);
      if (!reportDate) return false;

      const fromDate = range.from;
      const toDate = range.to || range.from;

      return (
        this.compareDates(reportDate, fromDate) >= 0 &&
        this.compareDates(reportDate, toDate) <= 0
      );
    });
  });

  protected readonly reports = computed(() => this.filteredReports());

  protected readonly totalReports = computed(() => this.filteredReports().length);

  protected readonly completedReports = computed(() => 
    this.filteredReports().filter(r => r.status === 'completed').length
  );

  protected readonly processingReports = computed(() => 
    this.filteredReports().filter(r => r.status === 'processing').length
  );

  protected readonly failedReports = computed(() => 
    this.filteredReports().filter(r => r.status === 'failed').length
  );

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.allReports.set(this.reportsService.getReports());
      this.isLoading.set(false);
    }, 5500);
  }

  protected reportTypeLabel(type: Report['type']): string {
    const labels: Record<Report['type'], string> = {
      certificate: 'Certificate',
      payment: 'Payment',
      dealer: 'Dealer',
      revenue: 'Revenue',
    };
    return labels[type];
  }

  protected reportTypeIcon(type: Report['type']): string {
    const icons: Record<Report['type'], string> = {
      certificate: '@tui.file-badge',
      payment: '@tui.credit-card',
      dealer: '@tui.store',
      revenue: '@tui.trending-up',
    };
    return icons[type];
  }

  protected statusLabel(status: Report['status']): string {
    const labels: Record<Report['status'], string> = {
      completed: 'Completed',
      processing: 'Processing',
      failed: 'Failed',
    };
    return labels[status];
  }

  protected onGenerateReport(): void {
    console.log('Generate new report');
  }

  protected onDownloadReport(report: Report): void {
    console.log('Download report:', report.id);
  }

  protected onViewReport(report: Report): void {
    console.log('View report:', report.id);
  }

  protected onDateRangeChange(range: TuiDayRange | null): void {
    this.dateRange.set(range);
  }

  protected clearDateFilter(): void {
    this.dateRange.set(null);
  }

  private parseDate(dateString: string): TuiDay | null {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      return new TuiDay(year, month - 1, day);
    } catch {
      return null;
    }
  }

  private compareDates(date1: TuiDay, date2: TuiDay): number {
    if (date1.year !== date2.year) return date1.year - date2.year;
    if (date1.month !== date2.month) return date1.month - date2.month;
    return date1.day - date2.day;
  }
}

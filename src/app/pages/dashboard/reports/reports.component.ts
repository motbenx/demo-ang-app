import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { Report, ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiIcon, TuiSkeleton],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  protected readonly isLoading = signal(true);
  protected readonly reports = signal<Report[]>([]);

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.reports.set(this.reportsService.getReports());
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
}

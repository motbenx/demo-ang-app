import { Injectable, signal } from '@angular/core';

export interface Report {
  id: string;
  title: string;
  generatedDate: string;
  period: string;
  category: string;
  type: 'revenue' | 'certificates' | 'dealers' | 'payments';
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly reports = signal<Report[]>([
    {
      id: 'RPT-001',
      title: 'Monthly Revenue Report',
      generatedDate: '2025-04-15',
      period: '2025-03',
      category: 'Revenue',
      type: 'revenue',
    },
    {
      id: 'RPT-002',
      title: 'Certificate Activity Report',
      generatedDate: '2025-04-14',
      period: '2025-03',
      category: 'Certificates',
      type: 'certificates',
    },
    {
      id: 'RPT-003',
      title: 'Dealer Performance Report',
      generatedDate: '2025-04-10',
      period: '2025-03',
      category: 'Dealers',
      type: 'dealers',
    },
    {
      id: 'RPT-004',
      title: 'Payment Summary Report',
      generatedDate: '2025-04-08',
      period: '2025-03',
      category: 'Payments',
      type: 'payments',
    },
  ]);

  getReports(): Report[] {
    return this.reports();
  }

  getReportsByDateRange(startDate: Date | null, endDate: Date | null): Report[] {
    if (!startDate || !endDate) {
      return this.reports();
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reports().filter(report => {
      const reportDate = new Date(report.generatedDate);
      return reportDate >= start && reportDate <= end;
    });
  }

  addReport(report: Report): void {
    this.reports.update(list => [...list, report]);
  }
}

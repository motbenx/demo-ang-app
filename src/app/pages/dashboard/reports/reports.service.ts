import { Injectable, signal } from '@angular/core';

export interface Report {
  id: string;
  title: string;
  generatedDate: string;
  type: 'sales' | 'certificates' | 'payments' | 'dealers';
  status: 'ready' | 'pending' | 'failed';
  fileSize?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly reports = signal<Report[]>([
    {
      id: 'RPT-001',
      title: 'Monthly Sales Report',
      generatedDate: '2025-04-01',
      type: 'sales',
      status: 'ready',
      fileSize: '2.4 MB',
    },
    {
      id: 'RPT-002',
      title: 'Certificate Statistics',
      generatedDate: '2025-04-02',
      type: 'certificates',
      status: 'ready',
      fileSize: '1.8 MB',
    },
    {
      id: 'RPT-003',
      title: 'Payment History',
      generatedDate: '2025-04-03',
      type: 'payments',
      status: 'ready',
      fileSize: '3.2 MB',
    },
    {
      id: 'RPT-004',
      title: 'Dealer Performance',
      generatedDate: '2025-04-05',
      type: 'dealers',
      status: 'pending',
    },
  ]);

  getReports(): Report[] {
    return this.reports();
  }

  addReport(report: Report): void {
    this.reports.update(list => [...list, report]);
  }

  deleteReport(id: string): void {
    this.reports.update(list => list.filter(r => r.id !== id));
  }
}

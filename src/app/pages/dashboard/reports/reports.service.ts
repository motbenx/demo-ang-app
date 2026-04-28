import { Injectable, signal } from '@angular/core';

export interface Report {
  id: string;
  title: string;
  type: 'certificate' | 'payment' | 'dealer' | 'revenue';
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: 'completed' | 'processing' | 'failed';
  fileSize: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly reports = signal<Report[]>([
    {
      id: 'RPT-2025-0015',
      title: 'Monthly Certificate Report - April 2025',
      type: 'certificate',
      generatedDate: '2025-04-01',
      generatedBy: 'Alex Morgan',
      period: 'April 2025',
      status: 'completed',
      fileSize: '2.4 MB',
    },
    {
      id: 'RPT-2025-0014',
      title: 'Payment Summary - Q1 2025',
      type: 'payment',
      generatedDate: '2025-03-31',
      generatedBy: 'Alex Morgan',
      period: 'Q1 2025',
      status: 'completed',
      fileSize: '1.8 MB',
    },
    {
      id: 'RPT-2025-0013',
      title: 'Dealer Performance Report - March 2025',
      type: 'dealer',
      generatedDate: '2025-03-28',
      generatedBy: 'Sarah Williams',
      period: 'March 2025',
      status: 'completed',
      fileSize: '3.1 MB',
    },
    {
      id: 'RPT-2025-0012',
      title: 'Revenue Analysis - February 2025',
      type: 'revenue',
      generatedDate: '2025-02-28',
      generatedBy: 'Alex Morgan',
      period: 'February 2025',
      status: 'completed',
      fileSize: '1.5 MB',
    },
    {
      id: 'RPT-2025-0011',
      title: 'Monthly Certificate Report - March 2025',
      type: 'certificate',
      generatedDate: '2025-03-01',
      generatedBy: 'Alex Morgan',
      period: 'March 2025',
      status: 'processing',
      fileSize: '—',
    },
    {
      id: 'RPT-2025-0010',
      title: 'Dealer Performance Report - February 2025',
      type: 'dealer',
      generatedDate: '2025-02-28',
      generatedBy: 'Sarah Williams',
      period: 'February 2025',
      status: 'completed',
      fileSize: '2.9 MB',
    },
    {
      id: 'RPT-2025-0009',
      title: 'Revenue Analysis - January 2025',
      type: 'revenue',
      generatedDate: '2025-01-31',
      generatedBy: 'Alex Morgan',
      period: 'January 2025',
      status: 'completed',
      fileSize: '1.7 MB',
    },
    {
      id: 'RPT-2025-0008',
      title: 'Payment Summary - Q4 2024',
      type: 'payment',
      generatedDate: '2024-12-31',
      generatedBy: 'Alex Morgan',
      period: 'Q4 2024',
      status: 'failed',
      fileSize: '—',
    },
  ]);

  getReports(): Report[] {
    return this.reports();
  }

  generateReport(report: Partial<Report>): void {
    const newReport: Report = {
      id: `RPT-${Date.now()}`,
      title: report.title || 'New Report',
      type: report.type || 'certificate',
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Alex Morgan',
      period: report.period || '',
      status: 'processing',
      fileSize: '—',
    };
    this.reports.update(list => [newReport, ...list]);
  }
}

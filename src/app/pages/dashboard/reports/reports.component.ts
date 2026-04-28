import { Component, signal } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputDateRange } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TuiButton, TuiIcon, TuiInputDateRange, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly dateRange = signal<TuiDayRange | null>(null);

  constructor() {
    const today = TuiDay.currentLocal();
    const thirtyDaysAgo = today.append({ day: -30 });
    this.dateRange.set(new TuiDayRange(thirtyDaysAgo, today));
  }
}

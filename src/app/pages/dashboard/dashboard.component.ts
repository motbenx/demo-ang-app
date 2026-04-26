import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TuiIcon],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  protected readonly user = signal({ name: 'Alex Morgan', role: 'Dealer Manager', initials: 'AM' });
  protected readonly collapsed = signal(true);

  protected readonly navItems = [
    { label: 'Overview',     icon: '@tui.layout-dashboard', route: '/dashboard/overview' },
    { label: 'Certificates', icon: '@tui.file-badge',       route: '/dashboard/certificates' },
    { label: 'Payments & Invoices', icon: '@tui.credit-card', route: '/dashboard/payments' },
    { label: 'Dealers',      icon: '@tui.store',            route: '/dashboard/dealers' },
    { label: 'Reports',      icon: '@tui.bar-chart-2',      route: '/dashboard/reports' },
    { label: 'Settings',     icon: '@tui.settings',         route: '/dashboard/settings' },
  ];

  protected toggleSidebar(): void {
    this.collapsed.update(v => !v);
  }
}

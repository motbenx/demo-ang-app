import { Injectable, signal } from '@angular/core';

export type DealerStatus = 'active' | 'inactive' | 'pending';

export interface Dealer {
  id: string;
  name: string;
  region: string;
  activeContracts: number;
  totalRevenue: number;
  status: DealerStatus;
  email: string;
  phone: string;
  joinedDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class DealersService {
  private readonly dealers = signal<Dealer[]>([
    {
      id: 'DLR-001',
      name: 'TechShop Vilnius',
      region: 'Lithuania',
      activeContracts: 342,
      totalRevenue: 45780.00,
      status: 'active',
      email: 'contact@techshop-vilnius.lt',
      phone: '+370 5 212 3456',
      joinedDate: '2023-01-15',
    },
    {
      id: 'DLR-002',
      name: 'SmartCity Kaunas',
      region: 'Lithuania',
      activeContracts: 287,
      totalRevenue: 38920.00,
      status: 'active',
      email: 'info@smartcity-kaunas.lt',
      phone: '+370 37 321 654',
      joinedDate: '2023-03-22',
    },
    {
      id: 'DLR-003',
      name: 'DigitalHub Riga',
      region: 'Latvia',
      activeContracts: 198,
      totalRevenue: 27340.00,
      status: 'active',
      email: 'sales@digitalhub.lv',
      phone: '+371 67 123 456',
      joinedDate: '2023-05-10',
    },
    {
      id: 'DLR-004',
      name: 'ElecZone Tallinn',
      region: 'Estonia',
      activeContracts: 156,
      totalRevenue: 21890.00,
      status: 'active',
      email: 'support@eleczone.ee',
      phone: '+372 6 123 456',
      joinedDate: '2023-07-18',
    },
    {
      id: 'DLR-005',
      name: 'Nordic Electronics Oslo',
      region: 'Norway',
      activeContracts: 412,
      totalRevenue: 58670.00,
      status: 'active',
      email: 'contact@nordic-elec.no',
      phone: '+47 22 123 456',
      joinedDate: '2022-11-05',
    },
    {
      id: 'DLR-006',
      name: 'Tech Plaza Warsaw',
      region: 'Poland',
      activeContracts: 523,
      totalRevenue: 72150.00,
      status: 'active',
      email: 'info@techplaza.pl',
      phone: '+48 22 123 4567',
      joinedDate: '2022-09-14',
    },
    {
      id: 'DLR-007',
      name: 'Baltic Tech Solutions',
      region: 'Lithuania',
      activeContracts: 89,
      totalRevenue: 12340.00,
      status: 'pending',
      email: 'contact@baltictech.lt',
      phone: '+370 5 234 5678',
      joinedDate: '2025-04-01',
    },
    {
      id: 'DLR-008',
      name: 'Digital Store Helsinki',
      region: 'Finland',
      activeContracts: 0,
      totalRevenue: 0.00,
      status: 'inactive',
      email: 'info@digitalstore.fi',
      phone: '+358 9 1234 5678',
      joinedDate: '2024-06-20',
    },
  ]);

  getAll(): Dealer[] {
    return this.dealers();
  }

  getById(id: string): Dealer | undefined {
    return this.dealers().find(dealer => dealer.id === id);
  }

  add(dealer: Dealer): void {
    this.dealers.update(dealers => [...dealers, dealer]);
  }

  update(id: string, partial: Partial<Dealer>): void {
    this.dealers.update(dealers =>
      dealers.map(dealer =>
        dealer.id === id ? { ...dealer, ...partial } : dealer
      )
    );
  }

  remove(id: string): void {
    this.dealers.update(dealers => dealers.filter(dealer => dealer.id !== id));
  }
}

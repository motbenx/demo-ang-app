import { Injectable, signal } from '@angular/core';
import { Dealer } from './dealers.component';

@Injectable({
  providedIn: 'root',
})
export class DealersService {
  private readonly dealers = signal<Dealer[]>([
    {
      id: 'DLR-001',
      name: 'TechShop Vilnius',
      contact: 'Mindaugas Kazlauskas',
      email: 'mindaugas@techshop.lt',
      phone: '+370 600 11111',
      address: 'Gedimino pr. 10, Vilnius, 01103',
      status: 'active',
      branches: 2,
      certificates: 145,
    },
    {
      id: 'DLR-002',
      name: 'SmartCity Kaunas',
      contact: 'Jurga Petraitė',
      email: 'jurga@smartcity.lt',
      phone: '+370 600 22222',
      address: 'Laisvės al. 20, Kaunas, 44231',
      status: 'active',
      branches: 1,
      certificates: 98,
    },
    {
      id: 'DLR-003',
      name: 'DigitalHub Riga',
      contact: 'Janis Berzins',
      email: 'janis@digitalhub.lv',
      phone: '+371 200 33333',
      address: 'Brīvības iela 40, Rīga, LV-1011',
      status: 'active',
      branches: 2,
      certificates: 67,
    },
    {
      id: 'DLR-004',
      name: 'ElecZone Tallinn',
      contact: 'Kristina Tamm',
      email: 'kristina@eleczone.ee',
      phone: '+372 500 44444',
      address: 'Pärnu mnt. 5, Tallinn, 10148',
      status: 'active',
      branches: 1,
      certificates: 54,
    },
    {
      id: 'DLR-005',
      name: 'MobileTech Warsaw',
      contact: 'Anna Kowalska',
      email: 'anna@mobiletech.pl',
      phone: '+48 600 555555',
      address: 'ul. Marszałkowska 15, Warszawa, 00-626',
      status: 'inactive',
      branches: 0,
      certificates: 0,
    },
    {
      id: 'DLR-006',
      name: 'GadgetStore Berlin',
      contact: 'Hans Mueller',
      email: 'hans@gadgetstore.de',
      phone: '+49 170 666666',
      address: 'Kurfürstendamm 50, Berlin, 10707',
      status: 'active',
      branches: 3,
      certificates: 201,
    },
    {
      id: 'DLR-007',
      name: 'PhoneHub Prague',
      contact: 'Petra Nováková',
      email: 'petra@phonehub.cz',
      phone: '+420 600 777777',
      address: 'Václavské nám. 10, Praha, 110 00',
      status: 'suspended',
      branches: 1,
      certificates: 23,
    },
  ]);

  getDealers(): Dealer[] {
    return this.dealers();
  }

  getDealerById(id: string): Dealer | undefined {
    return this.dealers().find(d => d.id === id);
  }

  addDealer(dealer: Dealer): void {
    this.dealers.update(list => [...list, dealer]);
  }

  updateDealer(id: string, updates: Partial<Dealer>): void {
    this.dealers.update(list =>
      list.map(d => (d.id === id ? { ...d, ...updates } : d))
    );
  }

  deleteDealer(id: string): void {
    this.dealers.update(list => list.filter(d => d.id !== id));
  }
}

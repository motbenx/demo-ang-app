import { Injectable, signal } from '@angular/core';
import { Certificate } from './certificates.component';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  private readonly certificates = signal<Certificate[]>([
    {
      certNo: 'LTU04000101', created: '2025-01-08', customer: 'Jonas Petraitis',
      phone: '+370 612 34567', dealer: 'TechShop Vilnius', branch: 'Vilnius Main',
      salesman: 'Tom K.', category: 'Smartphones', pricingName: 'Standard Plus',
      pricing: 89.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '24 months',
      validFrom: '2025-01-08', validTo: '2027-01-08',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 89.00,
      insurancePlan: 'Standard Plus', barcode: '11000100101',
      productCode: '1001010101', registryCode: '100101',
      manufacturer: 'Samsung', model: 'Galaxy S24',
      imeiSerial: '350100000000101', manufacturerWarranty: '24 months',
      devicePrice: 799.00, email: 'jonas.petraitis@gmail.com',
      address: 'Gedimino pr. 1, Vilnius, 01103',
    },
    {
      certNo: 'LTU04000102', created: '2025-01-15', customer: 'Marta Kowalski',
      phone: '+370 623 45678', dealer: 'SmartCity Kaunas', branch: 'Kaunas Central',
      salesman: 'Sarah L.', category: 'Laptops', pricingName: 'Premium',
      pricing: 249.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '36 months',
      validFrom: '2025-01-15', validTo: '2028-01-15',
      paymentType: 'Partial (3 months)', monthlyPayment: 83.00, certPrice: 249.00,
      insurancePlan: 'Premium', barcode: '11000100102',
      productCode: '1001010102', registryCode: '100102',
      manufacturer: 'Apple', model: 'MacBook Air M3',
      imeiSerial: 'C02XG0XXABCD', manufacturerWarranty: '12 months',
      devicePrice: 1299.00, email: 'marta.kowalski@gmail.com',
      address: 'ul. Długa 12, Warszawa, 00-238',
    },
    {
      certNo: 'LTU04000103', created: '2025-02-03', customer: 'Erik Jansen',
      phone: '+370 634 56789', dealer: 'DigitalHub Riga', branch: 'Riga Nord',
      salesman: 'Mike R.', category: 'E-Scooters', pricingName: 'Basic',
      pricing: 59.00, status: 'active',
      insuranceServiceType: 'ADH', insuranceTerm: '24 months',
      validFrom: '2025-02-03', validTo: '2027-02-03',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 59.00,
      insurancePlan: 'Basic', barcode: '11000100103',
      productCode: '1001010103', registryCode: '100103',
      manufacturer: 'Xiaomi', model: 'Mi Pro 4',
      imeiSerial: 'XM0041234567890', manufacturerWarranty: '12 months',
      devicePrice: 499.00, email: 'erik.jansen@gmail.com',
      address: 'Brīvības iela 55, Rīga, LV-1011',
    },
    {
      certNo: 'LTU04000104', created: '2025-02-20', customer: 'Aino Virtanen',
      phone: '+370 645 67890', dealer: 'ElecZone Tallinn', branch: 'Tallinn Park',
      salesman: 'Anna V.', category: 'Tablets', pricingName: 'Standard',
      pricing: 129.00, status: 'pending',
      insuranceServiceType: 'EW', insuranceTerm: '24 months',
      validFrom: '2025-02-20', validTo: '2027-02-20',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 129.00,
      insurancePlan: 'Standard', barcode: '11000100104',
      productCode: '1001010104', registryCode: '100104',
      manufacturer: 'Apple', model: 'iPad Pro 11"',
      imeiSerial: 'DMPU1234ABCD', manufacturerWarranty: '12 months',
      devicePrice: 999.00, email: 'aino.virtanen@gmail.com',
      address: 'Pärnu mnt. 10, Tallinn, 10148',
    },
    {
      certNo: 'LTU04000105', created: '2025-03-05', customer: 'Lukas Bauer',
      phone: '+370 656 78901', dealer: 'TechShop Vilnius', branch: 'Vilnius Main',
      salesman: 'Peter D.', category: 'Laptops', pricingName: 'Premium',
      pricing: 279.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '36 months',
      validFrom: '2025-03-05', validTo: '2028-03-05',
      paymentType: 'Partial (3 months)', monthlyPayment: 93.00, certPrice: 279.00,
      insurancePlan: 'Premium', barcode: '11000100105',
      productCode: '1001010105', registryCode: '100105',
      manufacturer: 'Lenovo', model: 'ThinkPad X1 Carbon',
      imeiSerial: 'LNV0512345678', manufacturerWarranty: '12 months',
      devicePrice: 1499.00, email: 'lukas.bauer@gmail.de',
      address: 'Hauptstraße 8, Berlin, 10115',
    },
    {
      certNo: 'LTU04000106', created: '2025-03-18', customer: 'Ieva Klimaite',
      phone: '+370 667 89012', dealer: 'SmartCity Kaunas', branch: 'Kaunas Central',
      salesman: 'Tom K.', category: 'Smartphones', pricingName: 'Standard Plus',
      pricing: 99.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '24 months',
      validFrom: '2025-03-18', validTo: '2027-03-18',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 99.00,
      insurancePlan: 'Standard Plus', barcode: '11000100106',
      productCode: '1001010106', registryCode: '100106',
      manufacturer: 'Apple', model: 'iPhone 15 Pro',
      imeiSerial: '350106000000001', manufacturerWarranty: '12 months',
      devicePrice: 1099.00, email: 'ieva.klimaite@gmail.com',
      address: 'Laisvės al. 55, Kaunas, 44231',
    },
    {
      certNo: 'LTU04000107', created: '2025-03-29', customer: 'Pavel Novak',
      phone: '+370 678 90123', dealer: 'DigitalHub Riga', branch: 'Riga Nord',
      salesman: 'Sarah L.', category: 'E-Scooters', pricingName: 'Basic',
      pricing: 59.00, status: 'expired',
      insuranceServiceType: 'ADH', insuranceTerm: '12 months',
      validFrom: '2025-03-29', validTo: '2026-03-29',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 59.00,
      insurancePlan: 'Basic', barcode: '11000100107',
      productCode: '1001010107', registryCode: '100107',
      manufacturer: 'Segway', model: 'Ninebot Max G2',
      imeiSerial: 'NB0071234567890', manufacturerWarranty: '12 months',
      devicePrice: 749.00, email: 'pavel.novak@gmail.cz',
      address: 'Václavské nám. 1, Praha, 110 00',
    },
    {
      certNo: 'LTU04000108', created: '2025-04-02', customer: 'Sigrid Olsen',
      phone: '+370 689 01234', dealer: 'ElecZone Tallinn', branch: 'Tallinn Park',
      salesman: 'Anna V.', category: 'Audio', pricingName: 'Standard',
      pricing: 69.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '24 months',
      validFrom: '2025-04-02', validTo: '2027-04-02',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 69.00,
      insurancePlan: 'Standard', barcode: '11000100108',
      productCode: '1001010108', registryCode: '100108',
      manufacturer: 'Sony', model: 'WH-1000XM5',
      imeiSerial: 'SN10081234567890', manufacturerWarranty: '12 months',
      devicePrice: 349.00, email: 'sigrid.olsen@gmail.no',
      address: 'Karl Johans gate 12, Oslo, 0154',
    },
    {
      certNo: 'LTU04000109', created: '2025-04-10', customer: 'Tomas Miklas',
      phone: '+370 690 12345', dealer: 'TechShop Vilnius', branch: 'Vilnius Main',
      salesman: 'Mike R.', category: 'Laptops', pricingName: 'Premium Pro',
      pricing: 349.00, status: 'active',
      insuranceServiceType: 'EW', insuranceTerm: '36 months',
      validFrom: '2025-04-10', validTo: '2028-04-10',
      paymentType: 'Partial (3 months)', monthlyPayment: 116.33, certPrice: 349.00,
      insurancePlan: 'Premium Pro', barcode: '11000100109',
      productCode: '1001010109', registryCode: '100109',
      manufacturer: 'Dell', model: 'XPS 15 9530',
      imeiSerial: 'DL10091234567890', manufacturerWarranty: '12 months',
      devicePrice: 1799.00, email: 'tomas.miklas@gmail.com',
      address: 'Antakalnio g. 22, Vilnius, 10312',
    },
    {
      certNo: 'LTU04000110', created: '2025-04-15', customer: 'Rasa Daugela',
      phone: '+370 601 23456', dealer: 'SmartCity Kaunas', branch: 'Kaunas Central',
      salesman: 'Peter D.', category: 'Smartphones', pricingName: 'Basic',
      pricing: 49.00, status: 'suspended',
      insuranceServiceType: 'EW', insuranceTerm: '12 months',
      validFrom: '2025-04-15', validTo: '2026-04-15',
      paymentType: 'Full', monthlyPayment: 0, certPrice: 49.00,
      insurancePlan: 'Basic', barcode: '11000100110',
      productCode: '1001010110', registryCode: '100110',
      manufacturer: 'Google', model: 'Pixel 8',
      imeiSerial: 'GG11001234567890', manufacturerWarranty: '12 months',
      devicePrice: 699.00, email: 'rasa.daugela@gmail.com',
      address: 'Savanorių pr. 10, Kaunas, 50127',
    },
  ]);

  getCertificates(): Certificate[] {
    return this.certificates();
  }

  getCertificateById(id: string): Certificate | undefined {
    return this.certificates().find(cert => cert.certNo === id);
  }

  addCertificate(certificate: Omit<Certificate, 'certNo' | 'barcode' | 'productCode' | 'registryCode' | 'created'>): Certificate {
    const generatedCertNo = this.generateCertificateNumber();
    const sequentialNumber = this.extractSequentialNumber(generatedCertNo);
    
    const newCertificate: Certificate = {
      ...certificate,
      certNo: generatedCertNo,
      barcode: this.generateBarcode(sequentialNumber),
      productCode: this.generateProductCode(sequentialNumber),
      registryCode: this.generateRegistryCode(sequentialNumber),
      created: this.getCurrentDate(),
    };

    this.certificates.update(certs => [...certs, newCertificate]);
    
    return newCertificate;
  }

  private generateCertificateNumber(): string {
    const certificates = this.certificates();
    
    if (certificates.length === 0) {
      return 'LTU04000101';
    }

    const certNumbers = certificates
      .map(cert => cert.certNo)
      .filter(certNo => certNo.startsWith('LTU040'))
      .map(certNo => parseInt(certNo.substring(6), 10))
      .filter(num => !isNaN(num));

    const maxNumber = certNumbers.length > 0 ? Math.max(...certNumbers) : 100;
    const nextNumber = maxNumber + 1;

    return `LTU040${nextNumber.toString().padStart(5, '0')}`;
  }

  private extractSequentialNumber(certNo: string): string {
    return certNo.substring(6);
  }

  private generateBarcode(sequentialNumber: string): string {
    return `110001${sequentialNumber}`;
  }

  private generateProductCode(sequentialNumber: string): string {
    const lastTwoDigits = sequentialNumber.substring(3);
    return `10010101${lastTwoDigits}`;
  }

  private generateRegistryCode(sequentialNumber: string): string {
    return `1${sequentialNumber}`;
  }

  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

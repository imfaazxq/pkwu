// utils/receiptGenerator.ts

interface TherapyItem {
  type: string;
  quantity: number;
  pricePerSession: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  complaint: string;
  status: 'on progress' | 'selesai';
  completedDate?: string;
  payment?: number;
  therapyItems?: TherapyItem[]; // New: array of therapy items
  therapistName?: string;
  notes?: string;
  receiptNumber?: string;
  // Legacy fields for backward compatibility
  therapyType?: string;
  quantity?: number;
}

// Generate receipt number
export const generateReceiptNumber = (): string => {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-6);
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  return `TR-${dateStr}-${timestamp}`;
};

// Generate receipt HTML content
const generateReceiptHTML = (client: Client): string => {
  // Handle backward compatibility and prepare therapy items
  let therapyItems: TherapyItem[] = [];
  
  if (client.therapyItems && client.therapyItems.length > 0) {
    therapyItems = client.therapyItems;
  } else {
    // Fallback to legacy single therapy
    therapyItems = [{
      type: client.therapyType || 'Terapi Kesehatan Umum',
      quantity: client.quantity || 1,
      pricePerSession: client.payment ? (client.payment / (client.quantity || 1)) : 0,
      total: client.payment || 0
    }];
  }

  const totalPayment = therapyItems.reduce((sum, item) => sum + item.total, 0);

  const therapyRowsHTML = therapyItems.map(item => `
    <tr>
      <td>
        <strong>${item.type}</strong>
        <br>
        <small style="color: #666;">Layanan terapi profesional</small>
      </td>
      <td style="text-align: center;">
        ${item.quantity} sesi
      </td>
      <td style="text-align: right;">
        Rp ${item.pricePerSession.toLocaleString('id-ID')}
      </td>
      <td style="text-align: right; font-weight: bold;">
        Rp ${item.total.toLocaleString('id-ID')}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nota Terapi - ${client.name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3A5645;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3A5645;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .clinic-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 20px;
        }
        .client-info, .receipt-details {
            flex: 1;
        }
        .receipt-details {
            text-align: right;
        }
        .info-title {
            font-size: 16px;
            font-weight: bold;
            color: #3A5645;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .info-item {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .info-label {
            font-weight: 600;
            color: #555;
        }
        .services-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .services-table th,
        .services-table td {
            border: 1px solid #ddd;
            padding: 15px 12px;
            text-align: left;
        }
        .services-table th {
            background-color: #3A5645;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        .services-table td {
            background-color: #fff;
        }
        .services-table tr:nth-child(even) td {
            background-color: #f9f9f9;
        }
        .total-section {
            text-align: right;
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3A5645;
        }
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #3A5645;
            margin-top: 10px;
        }
        .notes-section {
            margin: 30px 0;
            padding: 20px;
            background-color: #fff9e6;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
        }
        .notes-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
        }
        .notes-content {
            color: #856404;
            font-style: italic;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            gap: 40px;
        }
        .signature-box {
            text-align: center;
            flex: 1;
        }
        .signature-title {
            font-weight: bold;
            margin-bottom: 60px;
            color: #555;
        }
        .signature-line {
            border-top: 2px solid #333;
            padding-top: 8px;
            font-weight: bold;
            color: #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .thank-you {
            font-size: 16px;
            font-weight: bold;
            color: #3A5645;
            margin-bottom: 10px;
        }
        .receipt-number {
            background-color: #3A5645;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
        }
        @media print {
            body { 
                margin: 0; 
                padding: 15px;
            }
            .no-print { 
                display: none; 
            }
            .services-table {
                box-shadow: none;
            }
        }
        @media (max-width: 600px) {
            .receipt-info {
                flex-direction: column;
            }
            .receipt-details {
                text-align: left;
                margin-top: 20px;
            }
            .signature-section {
                flex-direction: column;
                gap: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Klinik Terapi Sehat</div>
        <div class="clinic-info">Telp: (+62)878 1583 6823 | Email: therapibuija@gmail.com</div>
        <div class="clinic-info">Website: www.therapibuija.com</div>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
        <span class="receipt-number">NOTA: ${client.receiptNumber || 'TR-000000'}</span>
    </div>

    <div class="receipt-info">
        <div class="client-info">
            <div class="info-title">Informasi Klien</div>
            <div class="info-item">
                <span class="info-label">Nama:</span> ${client.name}
            </div>
            <div class="info-item">
                <span class="info-label">Telepon:</span> ${client.phone}
            </div>
            <div class="info-item">
                <span class="info-label">Alamat:</span> ${client.address}
            </div>
            ${client.complaint ? `
            <div class="info-item">
                <span class="info-label">Keluhan:</span> ${client.complaint}
            </div>
            ` : ''}
        </div>
        <div class="receipt-details">
            <div class="info-title">Detail Transaksi</div>
            <div class="info-item">
                <span class="info-label">Tanggal:</span> ${client.completedDate ? new Date(client.completedDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
            </div>
            <div class="info-item">
                <span class="info-label">Terapis:</span> ${client.therapistName || 'Tim Terapis Profesional'}
            </div>
            <div class="info-item">
                <span class="info-label">Waktu Cetak:</span> ${new Date().toLocaleString('id-ID')}
            </div>
        </div>
    </div>

    <table class="services-table">
        <thead>
            <tr>
                <th style="width: 40%;">Jenis Layanan</th>
                <th style="width: 15%;">Jumlah</th>
                <th style="width: 20%;">Harga Satuan</th>
                <th style="width: 25%;">Total Harga</th>
            </tr>
        </thead>
        <tbody>
            ${therapyRowsHTML}
        </tbody>
    </table>

    ${client.notes ? `
    <div class="notes-section">
        <div class="notes-title">📝 Catatan Khusus:</div>
        <div class="notes-content">${client.notes}</div>
    </div>
    ` : ''}

    <div class="total-section">
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
            Subtotal: Rp ${totalPayment.toLocaleString('id-ID')}
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
            Pajak (0%): Rp 0
        </div>
        <div class="total-amount">
            TOTAL PEMBAYARAN: Rp ${totalPayment.toLocaleString('id-ID')}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            *Pembayaran telah diterima dengan baik
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-title">Klien</div>
            <div class="signature-line">${client.name}</div>
        </div>
        <div class="signature-box">
            <div class="signature-title">Terapis</div>
            <div class="signature-line">${client.therapistName || 'Tim Terapis'}</div>
        </div>
    </div>

    <div class="footer">
        <div class="thank-you">Terima Kasih Atas Kepercayaan Anda! 🙏</div>
        <p>Semoga lekas sembuh dan sehat selalu</p>
        <p>Untuk konsultasi lebih lanjut, silakan hubungi kami di nomor telepon di atas</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 10px; color: #999;">
            Nota ini sah dan merupakan bukti pembayaran resmi. Simpan nota ini sebagai bukti transaksi.
            <br>Dicetak pada: ${new Date().toLocaleString('id-ID')}
        </p>
    </div>
</body>
</html>
  `;
};

// Generate and download receipt as PDF using window.print
export const generateReceiptPDF = (client: Client): void => {
  const receiptHTML = generateReceiptHTML(client);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close window after printing (optional)
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
  }
};

// Alternative: Download as HTML file (kept for compatibility)
export const generateReceiptHTML_Download = (client: Client): void => {
  const receiptContent = generateReceiptHTML(client);
  
  // Create blob and download
  const blob = new Blob([receiptContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Nota-${client.receiptNumber || client.name.replace(/\s+/g, '')}-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate receipt with automatic PDF print
export const generateAndDownloadReceipt = (client: Client): void => {
  // Add receipt number if not exists
  if (!client.receiptNumber) {
    client.receiptNumber = generateReceiptNumber();
  }
  
  // Generate and print as PDF
  generateReceiptPDF(client);
};

// Preview receipt (updated for new structure)
export const previewReceipt = (client: Client): void => {
  if (!client.receiptNumber) {
    client.receiptNumber = generateReceiptNumber();
  }
  
  // Handle therapy items for preview
  let therapyItems: TherapyItem[] = [];
  if (client.therapyItems && client.therapyItems.length > 0) {
    therapyItems = client.therapyItems;
  } else {
    therapyItems = [{
      type: client.therapyType || 'Terapi Kesehatan Umum',
      quantity: client.quantity || 1,
      pricePerSession: client.payment ? (client.payment / (client.quantity || 1)) : 0,
      total: client.payment || 0
    }];
  }

  const totalPayment = therapyItems.reduce((sum, item) => sum + item.total, 0);
  
  const therapyItemsHTML = therapyItems.map((item, index) => `
    <div style="background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px;">
      <strong>${item.type}</strong><br>
      <small>Jumlah: ${item.quantity} sesi | Harga per sesi: Rp ${item.pricePerSession.toLocaleString('id-ID')} | Total: Rp ${item.total.toLocaleString('id-ID')}</small>
    </div>
  `).join('');
  
  const receiptWindow = window.open('', '_blank');
  if (receiptWindow) {
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Preview Nota - ${client.name}</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .preview-header { background: #3A5645; color: white; padding: 15px; text-align: center; border-radius: 8px; }
              .preview-content { margin: 20px 0; }
              .section { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
              .button { background: #3A5645; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
              .button:hover { background: #4d705b; }
          </style>
      </head>
      <body>
          <div class="preview-header">
              <h2>PREVIEW NOTA</h2>
              <p>Preview nota sebelum diunduh atau dicetak</p>
              <button class="button" onclick="window.close()">Tutup Preview</button>
          </div>
          
          <div class="preview-content">
            <div class="section">
              <h3>Informasi Klien</h3>
              <p><strong>Nama:</strong> ${client.name}</p>
              <p><strong>No. Nota:</strong> ${client.receiptNumber}</p>
              <p><strong>Telepon:</strong> ${client.phone}</p>
              <p><strong>Alamat:</strong> ${client.address}</p>
              ${client.complaint ? `<p><strong>Keluhan:</strong> ${client.complaint}</p>` : ''}
            </div>
            
            <div class="section">
              <h3>Detail Layanan</h3>
              ${therapyItemsHTML}
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #3A5645;">
                <strong style="font-size: 18px; color: #3A5645;">TOTAL PEMBAYARAN: Rp ${totalPayment.toLocaleString('id-ID')}</strong>
              </div>
            </div>
            
            <div class="section">
              <h3>Informasi Lainnya</h3>
              <p><strong>Terapis:</strong> ${client.therapistName || 'Tim Terapis Profesional'}</p>
              <p><strong>Tanggal Selesai:</strong> ${client.completedDate ? new Date(client.completedDate).toLocaleDateString('id-ID') : 'Hari ini'}</p>
              ${client.notes ? `<p><strong>Catatan:</strong> ${client.notes}</p>` : ''}
            </div>
          </div>
      </body>
      </html>
    `);
  }
};

// Utility function to calculate therapy items from form data
export const createTherapyItems = (therapyData: Array<{type: string, quantity: number, price: number}>): TherapyItem[] => {
  return therapyData.map(item => ({
    type: item.type,
    quantity: item.quantity,
    pricePerSession: item.price,
    total: item.quantity * item.price
  }));
};

export type { Client, TherapyItem };
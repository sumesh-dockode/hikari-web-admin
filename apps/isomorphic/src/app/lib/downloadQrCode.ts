import QRCode from 'qrcode';

export async function downloadQRCode(productId: string): Promise<void> {
  try {
    const canvas = document.createElement('canvas');

    // Encode QR with productId (can also be a full URL if needed)
    await QRCode.toCanvas(canvas, productId, {
      errorCorrectionLevel: 'H',
      width: 256,
    });

    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${productId}-qr.png`;
    link.click();
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
}

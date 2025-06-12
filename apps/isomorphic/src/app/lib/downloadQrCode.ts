import QRCodeStyling from 'qr-code-styling';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import apiClient from './apiClient';
import { API_ROUTES } from './api';

type Product = {
  id: string;
  product_name: string;
};

type LoaderCallbacks = {
  onStart?: () => void;
  onProgress?: (completed: number, total: number) => void;
  onFinish?: () => void;
};

async function generateQRCodeWithNameBlob(
  productId: string,
  productName: string
): Promise<Blob> {
  const qrSize = 300;
  const labelHeight = 40;

  const qr = new QRCodeStyling({
    width: qrSize,
    height: qrSize,
    margin: 2,
    data: productId,
    image: '/mLogo.png',
    dotsOptions: {
      type: 'classy-rounded',
      color: '#0d9488',
      roundSize: true,
    },
    backgroundOptions: {
      round: 0,
      color: '#ffffff',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 0,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#000000',
    },
  });

  // Render the QR to a Blob
  const qrBlob = await qr.getRawData('png');

  if (!qrBlob || !(qrBlob instanceof Blob)) {
    throw new Error('Failed to generate QR blob');
  }

  const qrImage = new Image();
  qrImage.src = URL.createObjectURL(qrBlob);
  await qrImage.decode();

  // Create a final canvas to combine QR and product name
  const canvas = document.createElement('canvas');
  canvas.width = qrSize;
  canvas.height = qrSize + labelHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Draw QR code
  ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

  // Draw label background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, qrSize, qrSize, labelHeight);

  // Draw product name
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(productName, qrSize / 2, qrSize + labelHeight / 2);

  // Export combined image to Blob
  return new Promise((resolve) => {
    canvas.toBlob((finalBlob) => {
      if (!finalBlob) throw new Error('Final canvas toBlob failed');
      resolve(finalBlob);
    }, 'image/png');
  });
}

export async function downloadAllQRCodesFromStockAPI({
  loaderCallbacks,
  orderId,
}: {
  loaderCallbacks: LoaderCallbacks;
  orderId: string;
}) {
  try {
    const res = await apiClient.get(`${API_ROUTES.stocks}?order=${orderId}`);
    const products: Product[] = res.data.data || [];

    const total = products.length;

    if (total === 0) {
      console.warn('No products found for this order');
      return;
    }

    loaderCallbacks?.onStart?.();

    if (total === 1) {
     
      const { id, product_name } = products[0];
      const blob = await generateQRCodeWithNameBlob(id, product_name);
      saveAs(blob, `${product_name}-${id}.png`);
      loaderCallbacks?.onProgress?.(1, 1);
      loaderCallbacks?.onFinish?.();
      return;
    }

   
    const zip = new JSZip();

    for (let i = 0; i < total; i++) {
      const { id, product_name } = products[i];
      const blob = await generateQRCodeWithNameBlob(id, product_name);
      zip.file(`${product_name}-${id}.png`, blob);
      loaderCallbacks?.onProgress?.(i + 1, total);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `qr-codes-${orderId}.zip`);
    loaderCallbacks?.onFinish?.();
  } catch (error) {
    console.error('Error generating QR codes:', error);
    loaderCallbacks?.onFinish?.(); // Ensure loader closes on failure too
  }
}



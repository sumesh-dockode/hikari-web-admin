declare module 'qrcode' {
  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: {
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    },
    callback?: (error: Error | null) => void
  ): Promise<void>;
}

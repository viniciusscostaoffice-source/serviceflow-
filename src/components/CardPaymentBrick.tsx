import { useEffect, useRef } from 'react';

interface CardBrickCallbackData {
  token: string;
  installments: number;
  paymentMethodId: string;
  issuerId?: string;
}

interface Props {
  amount: number;
  onSubmit: (data: CardBrickCallbackData) => Promise<void>;
  onError?: (err: unknown) => void;
}

declare global {
  interface Window {
    MercadoPago: new (key: string, opts?: { locale: string }) => {
      bricks: () => {
        create: (
          type: string,
          containerId: string,
          settings: object,
        ) => Promise<{ unmount: () => void }>;
      };
    };
  }
}

export function CardPaymentBrick({ amount, onSubmit, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const brickRef = useRef<{ unmount: () => void } | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;
    if (!publicKey) {
      console.error('[CardBrick] VITE_MP_PUBLIC_KEY não configurado.');
      return;
    }

    let cancelled = false;

    async function initBrick() {
      if (!window.MercadoPago) {
        console.error('[CardBrick] SDK do Mercado Pago não carregado.');
        return;
      }

      const mp = new window.MercadoPago(publicKey!, { locale: 'pt-BR' });
      const bricks = mp.bricks();

      if (cancelled) return;

      const brick = await bricks.create('cardPayment', 'cardPaymentBrick_container', {
        initialization: { amount },
        customization: {
          visual: { style: { theme: 'default' } },
          paymentMethods: { maxInstallments: 1 },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: async (cardData: CardBrickCallbackData) => {
            try {
              await onSubmit(cardData);
            } catch (err) {
              onError?.(err);
            }
          },
          onError: (err: unknown) => {
            console.error('[CardBrick] Erro:', err);
            onError?.(err);
          },
        },
      });

      if (!cancelled) {
        brickRef.current = brick;
      } else {
        brick.unmount();
      }
    }

    initBrick();

    return () => {
      cancelled = true;
      brickRef.current?.unmount();
      brickRef.current = null;
    };
  }, [amount, onSubmit, onError]);

  return <div id="cardPaymentBrick_container" ref={containerRef} />;
}

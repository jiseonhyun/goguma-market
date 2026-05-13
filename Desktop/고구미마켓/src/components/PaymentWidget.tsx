"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

interface PaymentWidgetProps {
  productId: string;
  productTitle: string;
  price: number;
  customerKey: string;
}

export default function PaymentWidget({
  productId,
  productTitle,
  price,
  customerKey,
}: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(CLIENT_KEY, customerKey);
      paymentWidgetRef.current = paymentWidget;

      paymentMethodsWidgetRef.current = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: price },
        { variantKey: "DEFAULT" }
      );

      paymentWidget.renderAgreement("#agreement-widget", {
        variantKey: "AGREEMENT",
      });

      setLoading(false);
    })();
  }, [customerKey, price]);

  async function handlePayment() {
    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget) return;

    setPaying(true);
    try {
      await paymentWidget.requestPayment({
        orderId: `order-${productId}-${Date.now()}`,
        orderName: productTitle,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error(err);
      setPaying(false);
    }
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          결제 수단 불러오는 중...
        </div>
      )}
      <div id="payment-widget" />
      <div id="agreement-widget" />
      {!loading && (
        <Button
          onClick={handlePayment}
          disabled={paying}
          className="w-full h-12 text-base font-semibold rounded-xl"
        >
          {paying ? "결제 진행 중..." : `₩${price.toLocaleString()} 결제하기`}
        </Button>
      )}
    </div>
  );
}

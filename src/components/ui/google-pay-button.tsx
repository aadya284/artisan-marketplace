"use client";

import React, { useEffect, useRef, useState } from "react";

interface GooglePayButtonProps {
  amount: number; // amount in rupees
  onSuccess?: (response: any) => void;
}

export default function GooglePayButton({ amount, onSuccess }: GooglePayButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paymentsClientRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Pay script if not present
    const existing = document.querySelector('script[src="https://pay.google.com/gp/p/js/pay.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://pay.google.com/gp/p/js/pay.js";
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => initClient();
      script.onerror = () => setError("Failed to load Google Pay script");
    } else {
      // script already present
      if ((window as any).google && (window as any).google.payments) {
        initClient();
      } else {
        // in case script is present but not yet initialized, wait a short time
        const t = setInterval(() => {
          if ((window as any).google && (window as any).google.payments) {
            clearInterval(t);
            initClient();
          }
        }, 100);
        return () => clearInterval(t);
      }
    }

    function initClient() {
      try {
        paymentsClientRef.current = new (window as any).google.payments.api.PaymentsClient({ environment: "TEST" });

        // Check if the user / browser can pay with the configured methods
        const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
        const allowedCardNetworks = ["AMEX", "VISA", "MASTERCARD", "DISCOVER"];

        const isReadyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: "CARD",
            parameters: {
              allowedAuthMethods: allowedCardAuthMethods,
              allowedCardNetworks: allowedCardNetworks,
            }
          }]
        };

        paymentsClientRef.current.isReadyToPay(isReadyToPayRequest).then((resp: any) => {
          if (resp && resp.result) {
            renderButton();
          } else {
            setError("Google Pay is not available for this browser/account.");
          }
        }).catch((err: any) => {
          console.error("isReadyToPay error", err);
          setError("Google Pay readiness check failed.");
        });
      } catch (err) {
        setError("Google Pay is not available in this environment.");
        console.error(err);
      }
    }

    function renderButton() {
      if (!paymentsClientRef.current || !containerRef.current) return;

      // clear container
      containerRef.current.innerHTML = "";

      const button = paymentsClientRef.current.createButton({
        onClick: onGPayClicked,
        buttonColor: "black",
        buttonType: "pay"
      });

      containerRef.current.appendChild(button);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // re-render button when amount changes (the click will read latest amount)
    if (paymentsClientRef.current && containerRef.current) {
      containerRef.current.innerHTML = "";
      const button = paymentsClientRef.current.createButton({ onClick: onGPayClicked, buttonColor: "black", buttonType: "pay" });
      containerRef.current.appendChild(button);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const onGPayClicked = async () => {
    setError(null);
    if (!paymentsClientRef.current) {
      setError("Google Pay is not initialized yet.");
      return;
    }

    const totalPrice = amount.toFixed(2);

    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
    } as any;

    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
    const allowedCardNetworks = ["AMEX", "VISA", "MASTERCARD", "DISCOVER"];

    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      parameters: {
        // 'example' is fine for TEST mode, but in production replace with your gateway (e.g. 'stripe').
        gateway: "example",
        gatewayMerchantId: "exampleGatewayMerchantId",
      },
    };

    const cardPaymentMethod = {
      type: "CARD",
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
        billingAddressRequired: true,
        billingAddressParameters: { format: "FULL" },
      },
      tokenizationSpecification,
    } as any;

    const paymentDataRequest = Object.assign({}, baseRequest, {
      allowedPaymentMethods: [cardPaymentMethod],
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: totalPrice,
        currencyCode: "INR",
        countryCode: "IN",
      },
      merchantInfo: {
        // For TEST mode you can use the sample merchant id. In production replace with your merchant id
        // obtained from the Google Pay & Wallet Console.
        merchantId: "12345678901234567890",
        merchantName: "Artisan Marketplace",
      },
    });

    try {
      setLoading(true);
      const paymentData = await paymentsClientRef.current.loadPaymentData(paymentDataRequest);

      // paymentData contains tokenizationData.token
      const token = paymentData?.paymentMethodData?.tokenizationData?.token;

      // send token to backend for processing (mock endpoint)
      await fetch("/api/payments/google-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paymentData }),
      });

      setLoading(false);
      if (onSuccess) onSuccess(paymentData);
    } catch (err: any) {
      console.error("Google Pay error:", err);
      setError(err?.message || "Payment failed or was cancelled.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div ref={containerRef} />
      {loading && <div className="text-sm text-gray-600 mt-2">Processing payment...</div>}
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  );
}

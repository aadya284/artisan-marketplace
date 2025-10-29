import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    // Verify the payment signature
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac("sha256", "Sifh1fW7eXWQf3sYg625WaZI")
      .update(text)
      .digest("hex");

    if (generated_signature === signature) {
      // Payment is successful
      return NextResponse.json({ 
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: "Payment verification failed" 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
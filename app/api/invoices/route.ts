// app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Invoice from '@/app/schema/invoiceSchema';

import { v4 as uuidv4 } from 'uuid';

function generateInvoiceNumber() {
  return 'INV-' + Date.now(); // or use uuidv4()
}

function calculateTotal(products: any[], charges: any[]) {
  const productTotal = products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
  const chargesTotal = charges.reduce((acc, c) => acc + c.amount, 0);
  return productTotal + chargesTotal;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();

    const newInvoice = new Invoice({
      customer: body.customerId,
      products: body.products,
      additionalCharges: body.charges,
      additionalFields: body.additionalFields,
      terms: body.terms,
      paymentOption: body.paymentOption,
      invoiceNumber: generateInvoiceNumber(), // ✅ Required
      invoiceDate: new Date(),                // Optional
      totalAmount: calculateTotal(body.products, body.charges), // ✅ Required
    });

    const savedInvoice = await newInvoice.save();
    return NextResponse.json({ success: true, invoice: savedInvoice });
  } catch (error: any) {
    console.error('🔴 Invoice Save Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongo();
    const invoices = await Invoice.find().populate('customer').populate('products.product');
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

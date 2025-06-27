'use client';
import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import AddProduct from '@/app/ui/dashboard/invoices/AddProduct';
import CustomerSelector from '@/app/ui/dashboard/invoices/CustomerSelector';
import InvoicePDF from '@/app/ui/front-end/InvoicePDF';
import { pdf } from '@react-pdf/renderer';

const GenerateInvoiceButton = ({
  customer,
  products,
  charges,
  additionalFields,
  terms,
  paymentOption,
}: any) => {

  const handleGeneratePDF = async () => {
    try {
      // ✅ Step 1: Send invoice to backend
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer._id,
          products: products.map((p: any) => ({
            productId: p._id,
             name: p.name,
            quantity: p.quantity,
            sellingPrice: p.sellingPrice,
          })),
          charges,
          additionalFields,
          terms,
          paymentOption,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error saving invoice:', data.error);
        alert('❌ Failed to save invoice. Try again.');
        return;
      }

      alert('✅ Invoice saved successfully!');

      // ✅ Step 2: Generate and download PDF
      const blob = await pdf(
        <InvoicePDF
          customer={customer}
          products={products}
          charges={charges}
          additionalFields={additionalFields}
          terms={terms}
          paymentOption={paymentOption}
        />
      ).toBlob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('❌ Something went wrong while generating the invoice.');
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      className="mt-6 px-6 py-3 bg-black text-white rounded"
    >
      Generate Invoice
    </button>
  );
};
export default function InvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    { _id: string; name: string; sellingPrice: number; quantity: number }[]
  >([]);
  const [additionalCharges, setAdditionalCharges] = useState<
    { name: string; amount: number }[]
  >([]);
  const [additionalFields, setAdditionalFields] = useState<
  { label: string; value: string }[]
>([]);

const handleAddField = () => {
  setAdditionalFields((prev) => [...prev, { label: '', value: '' }]);
};
const [terms, setTerms] = useState<string>(
  `1. Goods once sold will not be returned or exchanged.\n2. Warranty is as per manufacturer policy.\n3. Please check the items before leaving the counter.`
);

const [paymentOption, setPaymentOption] = useState<string>('Unpaid');

const handlePaymentChange = (option: string) => {
  setPaymentOption(option);
};




const handleFieldChange = (
  index: number,
  field: 'label' | 'value',
  newValue: string
) => {
  const updated = [...additionalFields];
  updated[index][field] = newValue;
  setAdditionalFields(updated);
};


  const handleAddProduct = (product: {
    _id: string;
    name: string;
    sellingPrice: number;
    quantity: number;
  }) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const updateProductQuantity = (index: number, delta: number) => {
  setSelectedProducts((prev) => {
    const updated = [...prev];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta); // Quantity min 1
    return updated;
  });
};

const handleRemoveProduct = (index: number) => {
  setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
};


  const handleAddCharge = () => {
    setAdditionalCharges((prev) => [...prev, { name: '', amount: 0 }]);
  };

const handleChargeChange = (
  index: number,
  field: 'name' | 'amount',
  value: string | number
) => {
  const updated = [...additionalCharges];
  if (field === 'amount') {
    updated[index].amount = Number(value);
  } else {
    updated[index].name = value.toString();
  }
  setAdditionalCharges(updated);
};



  const subtotal = selectedProducts.reduce(
    (acc, p) => acc + p.sellingPrice * p.quantity,
    0
  );
  const totalCharges = additionalCharges.reduce((acc, c) => acc + c.amount, 0);
  const grandTotal = subtotal + totalCharges;

  return (
    <div className="w-full p-4">
      <h1 className={`${lusitana.className} text-2xl`}>Create Invoice</h1>

      <div className="mt-4">
        <CustomerSelector onSelect={(c) => setSelectedCustomer(c)} />
      </div>

      {selectedCustomer && (
        <div className="mt-3 p-3 border rounded bg-gray-50">
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          {/* <p><strong>Email:</strong> {selectedCustomer.email}</p> */}
          <p><strong>Phone:</strong> {selectedCustomer.mobile}</p>
        </div>
      )}

      <div className="mt-6">
        <AddProduct onAdd={handleAddProduct} />
      </div>

      {selectedProducts.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Selected Products</h2>
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Product</th>
          <th className="p-2">Qty</th>
          <th className="p-2">Price</th>
          <th className="p-2">Subtotal</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {selectedProducts.map((p, idx) => (
          <tr key={idx}>
            <td className="p-2">{p.name}</td>
            <td className="p-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateProductQuantity(idx, -1)}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                {p.quantity}
                <button
                  onClick={() => updateProductQuantity(idx, 1)}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
            </td>
            <td className="p-2">₹{p.sellingPrice}</td>
            <td className="p-2">₹{p.sellingPrice * p.quantity}</td>
            <td className="p-2">
              <button
                onClick={() => handleRemoveProduct(idx)}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Additional Charges</h2>
        {additionalCharges.map((charge, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={charge.name}
              onChange={(e) =>
                handleChargeChange(index, 'name', e.target.value)
              }
              placeholder="Charge name (e.g. Shipping)"
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              value={charge.amount}
              onChange={(e) =>
                handleChargeChange(index, 'amount', Number(e.target.value))
              }
              placeholder="Amount"
              className="border p-2 rounded w-1/3"
            />
          </div>
        ))}

        <button
          onClick={handleAddCharge}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Charge
        </button>
      </div>
      <div className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Additional Fields</h2>
  {additionalFields.map((field, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        type="text"
        value={field.label}
        onChange={(e) =>
          handleFieldChange(index, 'label', e.target.value)
        }
        placeholder="Field name (e.g. IMEI)"
        className="border p-2 rounded w-1/2"
      />
      <input
        type="text"
        value={field.value}
        onChange={(e) =>
          handleFieldChange(index, 'value', e.target.value)
        }
        placeholder="Field value (e.g. 12345678)"
        className="border p-2 rounded w-1/2"
      />
    </div>
  ))}

  <button
    onClick={handleAddField}
    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
  >
    + Add Field
  </button>
</div>

<div className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
  <textarea
    value={terms}
    onChange={(e) => setTerms(e.target.value)}
    rows={5}
    className="w-full border p-3 rounded"
    placeholder="Enter terms and conditions"
  />
</div>

<div className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Payment Option</h2>
  <div className="flex gap-4">
    {['Unpaid', 'Cash', 'Online'].map((option) => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="radio"
          name="paymentOption"
          value={option}
          checked={paymentOption === option}
          onChange={() => setPaymentOption(option)}
        />
        {option}
      </label>
    ))}
  </div>
</div>





      <div className="mt-6 text-right">
        <p className="text-md">Subtotal: ₹{subtotal}</p>
        <p className="text-md">Additional Charges: ₹{totalCharges}</p>
        <p className="text-lg font-bold">Grand Total: ₹{grandTotal}</p>
              <GenerateInvoiceButton
              customer={selectedCustomer}
              products={selectedProducts}
              charges={additionalCharges}
              additionalFields={additionalFields}
              terms={terms}
              paymentOption={paymentOption}
            />
      </div>

    </div>
  );
}

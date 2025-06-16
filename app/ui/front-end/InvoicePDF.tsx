// components/InvoicePDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 6, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  tableHeader: {
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: { fontWeight: 'bold' },
  centered: { textAlign: 'center', marginTop: 10 },
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export default function InvoicePDF({
  company = {
    name: 'FaydaZone Pvt. Ltd.',
    address: '123 Market Street, Lucknow, India',
    phone: '+91 9999999999',
    email: 'support@faydazone.com',
  },
  invoiceNo = 'INV-0001',
  invoiceDate = new Date().toISOString(),
  customer,
  products,
  charges,
  additionalFields,
  terms,
  paymentOption,
}: {
  company?: any;
  invoiceNo?: string;
  invoiceDate?: string;
  customer: any;
  products: { name: string; sellingPrice: number; quantity: number }[];
  charges: { name: string; amount: number }[];
  additionalFields: { label: string; value: string }[];
  terms: string;
  paymentOption: string;
}) {
  const subtotal = products.reduce((sum, p) => sum + p.quantity * p.sellingPrice, 0);
  const totalCharges = charges.reduce((sum, c) => sum + c.amount, 0);
  const grandTotal = subtotal + totalCharges;
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);

  function numberToWords(n: number) {
    // Basic placeholder; real conversion should use a library
    return `${n} rupees only`;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>Phone: {company.phone} | Email: {company.email}</Text>
        </View>

        <View style={styles.row}>
          <View>
            <Text>Invoice No: {invoiceNo}</Text>
            <Text>Invoice Date: {formatDate(invoiceDate)}</Text>
          </View>
          <Text style={[styles.bold, { color: 'green' }]}>PAID</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.bold}>Bill To:</Text>
              <Text>{customer?.name}</Text>
              <Text>{customer?.mobile}</Text>
            </View>
            <View>
              <Text style={styles.bold}>Ship To:</Text>
              <Text>{customer?.name}</Text>
              <Text>{customer?.mobile}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Items</Text>
          <View style={styles.tableHeader}>
            <Text>Name</Text>
            <Text>Price/Unit</Text>
            <Text>Qty</Text>
            <Text>Total</Text>
          </View>
          {products.map((p, i) => (
            <View key={i} style={styles.row}>
              <Text>{p.name}</Text>
              <Text>₹{p.sellingPrice}</Text>
              <Text>{p.quantity}</Text>
              <Text>₹{p.quantity * p.sellingPrice}</Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text>Total Quantity: {totalQty}</Text>
          </View>
        </View>

        {charges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Additional Charges</Text>
            {charges.map((c, i) => (
              <Text key={i}>
                {c.name}: ₹{c.amount}
              </Text>
            ))}
          </View>
        )}

        {additionalFields.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Additional Info</Text>
            {additionalFields.map((f, i) => (
              <Text key={i}>
                {f.label}: {f.value}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text>Payment Mode: {paymentOption}</Text>
          <Text>Subtotal: ₹{subtotal}</Text>
          <Text>Additional Charges: ₹{totalCharges}</Text>
        </View>

        <View style={[styles.section, { borderTop: '1px solid black', paddingTop: 4 }]}>
          <Text style={styles.bold}>Grand Total: ₹{grandTotal}</Text>
          <Text style={styles.bold}>In Words: {numberToWords(grandTotal)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Terms & Conditions</Text>
          {terms.split('\n').map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </View>

        <Text style={styles.centered}>Thank you for your business!</Text>
        <Text style={[styles.centered, { marginTop: 30 }]}>Authorised Signature</Text>
      </Page>
    </Document>
  );
}

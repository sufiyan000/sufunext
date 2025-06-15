// components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  section: { marginBottom: 10 },
  heading: { fontSize: 14, marginBottom: 6, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  tableHeader: { fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: 2 },
});

export default function InvoicePDF({
  customer,
  products,
  charges,
  additionalFields,
  terms,
  paymentOption,
}: {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>INVOICE</Text>
        </View>

        <View style={styles.section}>
          <Text>Customer Name: {customer?.name}</Text>
          <Text>Phone: {customer?.mobile}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Products</Text>
          <View style={styles.row}>
            <Text style={styles.tableHeader}>Name</Text>
            <Text style={styles.tableHeader}>Qty</Text>
            <Text style={styles.tableHeader}>Price</Text>
            <Text style={styles.tableHeader}>Subtotal</Text>
          </View>
          {products.map((p, i) => (
            <View key={i} style={styles.row}>
              <Text>{p.name}</Text>
              <Text>{p.quantity}</Text>
              <Text>₹{p.sellingPrice}</Text>
              <Text>₹{p.sellingPrice * p.quantity}</Text>
            </View>
          ))}
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
          <Text>Grand Total: ₹{grandTotal}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Terms & Conditions</Text>
          {terms.split('\n').map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}

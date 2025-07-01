// app/components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: { margin: 10, padding: 10, fontSize: 12 },
});

export default function InvoicePDF({ order }: { order: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.section}>
        <Text>Invoice for Order #{order._id}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Payment: {order.paymentMethod}</Text>
        <Text>Total: ₹{order.totalCost.toFixed(2)}</Text>
        <Text>Items:</Text>
        {order.orderItems.map((item: any, idx: number) => (
          <Text key={idx}>
            - {item.name} × {item.quantity} = ₹{item.total}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

"use client"
import { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image} from '@react-pdf/renderer';
type PurchaseType = {
  _id: string;
  product_image: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  purchase_status: "pending" | "completed" | "cancelled";
  suppliers_id: any;
  createdAt: string; // Date ko string ke roop me store karna better hai agar API se aa raha hai
};

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 16, marginBottom: 10, textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", borderBottom: "1px solid black", padding: 5 },
  cellHeader: { borderBottom: "1px solid black", padding: 5, fontWeight: "bold" },
  cell: { borderBottom: "1px solid black", padding: 5 },
  footer: { marginTop: 10, fontWeight: "bold", textAlign: "right" },
});

const PurchasePDF = ({ supplier, products }: { supplier: string; products: PurchaseType[] }) => {
  const totalAmount = products.reduce((acc, p) => acc + p.total, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Purchase Report - {supplier}</Text>
        
          <View style={[styles.row, { backgroundColor: "#f2f2f2" }]}>
            <Text style={[styles.cellHeader, { flex: 2 }]}>Product</Text>
            <Text style={[styles.cellHeader, { flex: 1 }]}>Price</Text>
            <Text style={[styles.cellHeader, { flex: 1 }]}>Quantity</Text>
            <Text style={[styles.cellHeader, { flex: 1 }]}>Total</Text>
          </View>

          {products.map((purchase) => (
            <View key={purchase._id} style={styles.row}>
              <Image src={purchase.product_image} style={{ width: 50, height: 50, margin: 5 }} />
              <Text style={[styles.cell, { flex: 2 }]}>{purchase.title}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{purchase.price}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{purchase.quantity}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{purchase.total}</Text>
            </View>
          ))}


        <Text style={styles.footer}>Total Products: {products.length} | Grand Total: ₹{totalAmount}</Text>
      </Page>
    </Document>
  );
};

const PurchaseList = () => {
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  // ✅ Unique Supplier Names
  const uniqueSuppliers = Array.from(new Set(purchases.map(order => order.suppliers_id.name)));

  // ✅ Filtered Products
  const filteredProducts = selectedSupplier
    ? purchases.filter(order => order.suppliers_id.name === selectedSupplier)
    : purchases;


  useEffect(() => {
    // Fetch purchases from API (replace with actual API call)
    const fetchPurchases = async () => {
      const res = await fetch("/api/purchase"); // API endpoint
      const data = await res.json();
      console.log(data);
      setPurchases(data.purchase);
    };
    fetchPurchases();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      <div className="flex justify-between mb-4">
      <h2 className="text-2xl font-semibold mb-4">Purchase List</h2>
      
                 {/* Supplier Dropdown */}
              <select onChange={(e) => setSelectedSupplier(e.target.value)} value={selectedSupplier}>
                <option value="">All Suppliers</option>
                {uniqueSuppliers.map(supplier => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>

              {selectedSupplier && filteredProducts.length > 0 && (
              <PDFDownloadLink
                document={<PurchasePDF supplier={selectedSupplier} products={filteredProducts} />}
                fileName={`purchase_${selectedSupplier}.pdf`}
              >
                {({ loading }) => (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    {loading ? 'Generating...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
              )}

      </div>
      
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Product Image</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Total</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((purchase) => (
              <tr key={purchase._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-center">
                  <img src={purchase.product_image} alt={purchase.title} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-3">{purchase.title}</td>
                <td className="p-3">{purchase.price}</td>
                <td className="p-3">{purchase.quantity}</td>
                <td className="p-3">{purchase.total}</td>
                <td className={`p-3 font-semibold ${purchase.purchase_status === "completed" ? "text-green-600" : purchase.purchase_status === "pending" ? "text-red-600" : "text-yellow-600"}`}>
                  <select>
                  <option value={purchase.purchase_status}>Pending</option>
                  <option value="completed" className="text-green-600">Completed</option>
                  <option value="cancelled" className="text-red-600">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseList;

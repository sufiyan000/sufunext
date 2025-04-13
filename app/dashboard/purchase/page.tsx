"use client"
import { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image} from '@react-pdf/renderer';
import axios from 'axios';
type PurchaseType = {
  _id: string;
  product_image: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  purchase_status: "pending" | "completed";
  suppliers_id: any;
  createdAt: string; // Date ko string ke roop me store karna better hai agar API se aa raha hai
};
type SupplierInfo = {
  _id: string;
  name: string;
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
               <Image src={purchase.product_image || "https://via.placeholder.com/50"} style={{ width: 50, height: 50, margin: 5 }} />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  // ✅ Unique Supplier Names
  const uniqueSuppliers: SupplierInfo[] = Array.from(
    purchases.reduce((map, order) => {
      if (order.suppliers_id?._id && order.suppliers_id?.name) {
        map.set(order.suppliers_id._id, order.suppliers_id.name);
      }
      return map;
    }, new Map<string, string>())
  ).map(([id, name]) => ({ _id: id, name }));
  

  // ✅ Filtered Products
  const filteredProducts = selectedSupplier
  ? purchases.filter(order => order.suppliers_id?._id === selectedSupplier)
  : purchases;



    useEffect(() => {
      const fetchPurchases = async () => {
        try {
          setLoading(true); // Show loading while fetching data
          const response = await axios.get("/api/purchase"); // API call
          console.log(response.data);
          setPurchases(response.data.purchase);
        } catch (error: any) {
          console.error("Error fetching purchases:", error);
          setError("Failed to fetch purchases"); // Set error message
        } finally {
          setLoading(false); // Hide loading after request completes
        }
      };
      fetchPurchases();
    }, []);
    

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      <div className="flex justify-between mb-4">
      {loading && <p>Loading purchases...</p>}
      {error && <p>Error: {error}</p>}
      <h2 className="text-2xl font-semibold mb-4">Purchase List</h2>
      
                 {/* Supplier Dropdown */}
                 <select onChange={(e) => setSelectedSupplier(e.target.value)} value={selectedSupplier}>
                  <option value="">All Suppliers</option>
                  {uniqueSuppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
                </select>

                {selectedSupplier && filteredProducts.length > 0 && (
              <PDFDownloadLink
                key={selectedSupplier}  // ✅ Force remount on supplier change
                document={
                  <PurchasePDF
                    supplier={filteredProducts[0]?.suppliers_id?.name || selectedSupplier}
                    products={filteredProducts}
                  />
                }
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
                <select
              value={purchase.purchase_status}
              onChange={async (e) => {
                const newStatus = e.target.value;
                if (newStatus === "completed" && purchase.purchase_status !== "completed") {
                  const confirmed = window.confirm("Are you sure you want to mark this purchase as completed? It will be deleted.");
                  if (!confirmed) return;

                  try {
                    const res = await axios.delete(`/api/purchase/completed/${purchase._id}`);
                    console.log(res.data);

                    // Remove the product from UI
                    setPurchases((prev) => prev.filter((p) => p._id !== purchase._id));
                  } catch (err) {
                    console.error("Error deleting purchase:", err);
                    alert("Failed to delete the purchase.");
                  }
                }
              }}
            >
                  <option value={purchase.purchase_status}>Pending</option>
                  <option value="completed" className="text-green-600">Completed</option>
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

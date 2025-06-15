'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
}

export default function AddProduct({
  onAdd,
}: {
  onAdd: (product: {
    _id: string;
    name: string;
    sellingPrice: number;
    quantity: number;
  }) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('/api/products'); // Ensure this route works
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  // Search on input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') {
      setFiltered([]);
    } else {
      const filteredList = products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredList);
    }
  };

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name); // set value in input
    setFiltered([]);
  };

  const handleAdd = () => {
    if (selectedProduct && quantity > 0) {
      onAdd({ ...selectedProduct, quantity });
      // Reset
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-2 relative">
      <label className="block font-medium">Product Name</label>
      <input
        type="text"
        value={searchTerm}
        onInput={handleInput}
        placeholder="Search product..."
        className="w-full border p-2 rounded"
      />

      {filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-48 overflow-y-auto shadow">
          {filtered.map((p) => (
            <li
              key={p._id}
              onClick={() => handleSelect(p)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}

      {selectedProduct && (
        <div className="mt-3 flex items-center gap-3">
          <div className="font-medium">{selectedProduct.name}</div>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border p-1 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

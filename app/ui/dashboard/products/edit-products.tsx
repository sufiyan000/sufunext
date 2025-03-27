"use client"
import React, { useState, useEffect} from "react";
import {  message } from 'antd';
import axios from 'axios';
import Image from "next/image";
import { redirect } from "next/navigation";
interface Attribute {
  key: string;
  value: string;
  _id: string;
}
interface IAttribute {
  key: string;
  value: string | number | boolean;
}
interface Supplier {
  _id: string;
  name: string;
}

interface SupplierDetails {
  name: string;
  email: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  thumbnailUrl: string;
  videoUrl: string;
  brand: string;
  sku: string;
  warranty: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  regularPrice: number;
  stock: number;
  attributes: Attribute[];
  tags: string[];
  isFeatured: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  supplierDetails: SupplierDetails;
  suppliers: string;
  categoryDetails: string[];
  subCategoryDetails: string[];
  subLevelDetails: string[];
}

interface EditProductPageProps {
  product: Product;
}


const EditProductPage: React.FC<EditProductPageProps> = ({ product }) => {
  
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("/api/suppliers");
        console.log(response.data.supplier);
        setSuppliers(response.data.supplier); // Ensure response.data contains an array
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
   const [messageApi, contextHolder] = message.useMessage();
    const success = (message: string) => {
      messageApi.open({
        type: 'success',
        content: message,
      });
    };
  
    const error = () => {
      messageApi.open({
        type: 'error',
        content: 'This is an error message',
      });
    };
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
      };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.put('/api/products', newProduct);
    console.log("Submitting Product:", response);
    success(response.data.message);
    
  };
  const initialProductState = {
    name: product.name,
    thumbnailUrl: product.thumbnailUrl,
    videoUrl: product.videoUrl,
    brand: product.brand,
    sku: product.sku,
    warranty: product.warranty,
    description: product.description,
    suppliers: product.suppliers,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    regularPrice: product.regularPrice,
    stock: product.stock,
    categories: product.categoryDetails,
    subCategories: product.subCategoryDetails,
    subLevels: product.subLevelDetails,
    // attributes: [{ key: "", value: "" }],
    tags: product.tags,
    isFeatured: product.isFeatured,
    // images: [""],
  };

  const [newProduct, setNewProduct] = useState({
      id: product._id,
      name: product.name,
      thumbnailUrl: product.thumbnailUrl,
      videoUrl: product.videoUrl,
      brand: product.brand,
      sku: product.sku,
      warranty: product.warranty,
      description: product.description,
      suppliers: product.suppliers,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      regularPrice: product.regularPrice,
      stock: product.stock,
      categories: [product.categoryDetails],
      subCategories: [product.subCategoryDetails],
      subLevels: [product.subLevelDetails],
      attributes: product.attributes,
      tags: product.tags,
      isFeatured: false,
      images: [""],
    });

  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    value: string | number | boolean
  ) => {
    const updatedAttributes = [...newProduct.attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value,
    };
  };
  const addAttribute = () => {
  };
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          {contextHolder}
          <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
          <div>
            
                {/* <label className="block text-sm font-medium text-gray-700">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4 mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300"
                /> */}
                {/* {thumbnailFile && (
                  <button
                    type="button"
                    onClick={uploadThumbnail}
                    disabled={isUploading}
                    className={`mt-2 px-4 py-2 rounded ${
                      isUploading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </button>
                )} */}
                {initialProductState.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-green-500">Uploaded Image:</p>
                    <Image
                      src={initialProductState.thumbnailUrl}
                      alt="Thumbnail"
                      className="mt-2 w-32 h-32 rounded"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="thumbnailUrl"
                placeholder="Thumbnail URL"
                value={newProduct.thumbnailUrl}
                disabled
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL"
                value={newProduct.videoUrl}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="warranty"
                placeholder="Warranty"
                value={newProduct.warranty}
                onChange={handleChange}
                className="input-field"
              />
              <textarea
                name="description"
                placeholder="Product Description"
                value={newProduct.description}
                onChange={handleChange}
                className="input-field h-24"
              ></textarea>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select
                name="suppliers"
                value={newProduct.suppliers}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, suppliers: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="" disabled>
                  Select a Supplier
                </option>
                <option key={initialProductState.suppliers} value={initialProductState.suppliers}>
                  {initialProductState.suppliers}
                  
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
               
              </select>
    
              <select
                name="categories"
                value={newProduct.categories[0] || ""}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="" disabled>
                  Select a Category
                </option>
                <option>
                  {newProduct.categories.length > 0 && newProduct.categories}
                </option>
                
              </select>
    
               <select
                name="subCategories"
                value={newProduct.subCategories[0] || ""}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="" disabled>
                  Select a sub-Category
                </option>
                {
                 
                    <option>
                      {newProduct.subCategories}
                    </option>
                }
              </select>
                  
              
                  <select
                name="subLevels"
                onChange={handleChange}
                className="input-field"
                required
                >
                  <option value="" disabled>
                    Select a subLevels
                  </option>
                      <option>
                       {newProduct.subLevels}
                      </option>
                  
                </select>
              
              <input
                type="number"
                name="purchasePrice"
                placeholder="Purchase Price"
                value={newProduct.purchasePrice}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                className="input-field"
                required
              />
              <input
                type="number"
                name="sellingPrice"
                placeholder="Selling Price"
                value={newProduct.sellingPrice}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                className="input-field"
                required
              />
              <input
                type="number"
                name="regularPrice"
                placeholder="Regular Price"
                value={newProduct.regularPrice}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                className="input-field"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                className="input-field"
                required
              />
    
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={newProduct.sku}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
    
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="Enter tags separated by commas"
                value={newProduct.tags.join(", ")}
                className="input-field"
              />
            </div>
    
            <div>
              <h3 className="text-lg font-semibold mb-2">Attributes</h3>
              {newProduct.attributes.map((attr, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                    className="input-field"
                  />
                </div>
              ))}
              <button type="button" onClick={addAttribute} className="btn-add">
                Add Attribute
              </button>
            </div>
    
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={newProduct.isFeatured}
                  className="mr-2"
                  onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                />
                Featured Product
              </label>
            </div>
    
            <button type="submit" className="btn-submit">
              Submit Product
            </button>
          </form>
        </div>
  );
};

export default EditProductPage;

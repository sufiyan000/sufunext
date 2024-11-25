"use client";
import React, { useState } from "react";

interface IAttribute {
  key: string;
  value: string | number | boolean;
}

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState({
    name: "",
    thumbnailUrl: "",
    videoUrl: "",
    brand: "",
    warranty: "",
    description: "",
    suppliers: "",
    category: "",
    purchasePrice: "",
    price: "",
    regularPrice: "",
    stock: "",
    categories: [""],
    subCategories: [""],
    subLevels: [""],
    attributes: [{ key: "", value: "" }] as IAttribute[],
    isFeatured: false,
    images: [""],
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", thumbnailFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setProduct({ ...product, thumbnailUrl: data.fileUrl });
        alert("Image uploaded successfully!");
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    value: string | number | boolean
  ) => {
    const updatedAttributes = [...product.attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value,
    };
    setProduct({ ...product, attributes: updatedAttributes });
  };
  

  const addAttribute = () => {
    setProduct({ ...product, attributes: [...product.attributes, { key: "", value: "" }] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Product:", product);
    // Add logic to send data to your API
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <div>
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300"
            />
            {thumbnailFile && (
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
            )}
            {product.thumbnailUrl && (
              <div className="mt-4">
                <p className="text-sm text-green-500">Uploaded Image:</p>
                <img
                  src={product.thumbnailUrl}
                  alt="Thumbnail"
                  className="mt-2 w-32 h-32 rounded"
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
            value={product.name}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="thumbnailUrl"
            placeholder="Thumbnail URL"
            value={product.thumbnailUrl}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="videoUrl"
            placeholder="Video URL"
            value={product.videoUrl}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={product.brand}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="warranty"
            placeholder="Warranty"
            value={product.warranty}
            onChange={handleChange}
            className="input-field"
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            className="input-field h-24"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <select
            name="suppliers"
            value={product.suppliers}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="" disabled>
              Select a Supplier
            </option>
            <option value="Supplier1">Supplier 1</option>
            <option value="Supplier2">Supplier 2</option>
            <option value="Supplier3">Supplier 3</option>
          </select>

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="" disabled>
              Select a Supplier
            </option>
            <option value="Supplier1">Supplier 1</option>
            <option value="Supplier2">Supplier 2</option>
            <option value="Supplier3">Supplier 3</option>
          </select>

          <input
            type="number"
            name="purchasePrice"
            placeholder="Purchase Price"
            value={product.purchasePrice}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Selling Price"
            value={product.price}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="number"
            name="regularPrice"
            placeholder="Regular Price"
            value={product.regularPrice}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={product.stock}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Attributes</h3>
          {product.attributes.map((attr, index) => (
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
                value={attr.value as string}
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
              checked={product.isFeatured}
              onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
              className="mr-2"
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

export default ProductForm;

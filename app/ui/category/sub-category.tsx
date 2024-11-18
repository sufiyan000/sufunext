"use client"
import React, { useState, ChangeEvent, FormEvent } from "react";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
}

const SubCategoryPage: React.FC = () => {
  // Dummy data for categories and subcategories
  const dummyCategories: Category[] = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Home & Kitchen" },
  ];

  const [categories] = useState<Category[]>(dummyCategories);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { _id: "1", name: "Mobiles", description: "Smartphones and accessories", categoryId: "1" },
    { _id: "2", name: "Clothing", description: "Men's and Women's Wear", categoryId: "2" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newSubCategory: SubCategory = {
      _id: (subCategories.length + 1).toString(),
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
    };

    setSubCategories((prev) => [...prev, newSubCategory]);

    // Reset form data
    setFormData({ name: "", description: "", categoryId: "" });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Subcategories</h1>

      {/* Subcategory Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Subcategory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Subcategory
          </button>
        </form>
      </div>

      {/* Subcategory List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Subcategory List</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {subCategories.length > 0 ? (
            <ul className="space-y-4">
              {subCategories.map((subCategory) => (
                <li key={subCategory._id} className="border-b pb-4">
                  <h3 className="text-lg font-medium">{subCategory.name}</h3>
                  <p className="text-sm text-gray-500">{subCategory.description}</p>
                  <p className="text-sm text-gray-500">
                    Category:{" "}
                    {categories.find((cat) => cat.id === subCategory.categoryId)?.name || "Unknown"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subcategories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;

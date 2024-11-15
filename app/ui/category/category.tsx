"use client"
import React, { useState } from "react";

interface SubCategory {
  name: string;
  description?: string;
}

interface Category {
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

const CategoryForm: React.FC = () => {
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    subCategories: [],
  });

  const [newSubCategory, setNewSubCategory] = useState<SubCategory>({
    name: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSubCategory((prev) => ({ ...prev, [name]: value }));
  };

  const addSubCategory = () => {
    if (newSubCategory.name.trim() === "") {
      alert("Subcategory name is required.");
      return;
    }
    setCategory((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategory],
    }));
    setNewSubCategory({ name: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Category Data:", category);
    alert("Category added successfully!");
    // Reset form
    setCategory({ name: "", description: "", subCategories: [] });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Category Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium"
          >
            Category Description
          </label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Enter category description (optional)"
          />
        </div>

        {/* Add Subcategory */}
        

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
        >
          Save Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;

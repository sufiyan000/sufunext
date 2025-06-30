"use client";
import { useState } from "react";
import api from '@/app/lib/axiosClient';
interface Category {
  _id: string;
  name: string;
  description: string;
}

interface AddSubCategoryFormProps {
  category: Category[]; // Array of category objects
}
const AddSubCategoryForm: React.FC<AddSubCategoryFormProps> = ({category}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !subCategory || !description) {
      alert("Please fill in all fields.");
      return;
    }

    // API call to save the sub-category
    try {
      console.log(selectedCategory,subCategory,description);
      const data = {
        categoryId: selectedCategory,
        name: subCategory,
        description,
      }
      const response = await api.post("/api/sub-category", data);

      if (response.data.status === "success") {
        alert("Sub-category added successfully!");
        setSubCategory("");
        setDescription("");
      } else {
        alert(`Error: "Failed to add sub-category"`);
      }
    } catch (error) {
      alert("An error occurred while adding the sub-category.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Add Sub-Category
        </h2>
        <form onSubmit={handleFormSubmit}>
          {/* Category Selection */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Choose a category --
              </option>
              {
                category.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              }
              
            </select>
          </div>

          {/* Sub-Category Input */}
          <div className="mb-4">
            <label
              htmlFor="subCategory"
              className="block text-gray-700 font-medium mb-2"
            >
              Sub-Category Name
            </label>
            <input
              id="subCategory"
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="Enter sub-category name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for the sub-category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Sub-Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryForm;

"use client"
import React, { useState } from "react";
import axios from 'axios';

interface Category {
  name: string;
  description?: string;
  
}

const CategoryForm: React.FC = () => {
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    
  });



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  const data = {
    name: category.name,
    description: category.description,
  }
   
    alert("Category added successfully!");
    const response = await axios.post('http://localhost:3000//api/category/create-category', data);
    console.log(response);
    // Reset form
   
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

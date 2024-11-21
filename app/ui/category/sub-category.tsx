'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
}

export default function CategorySubcategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState<Omit<SubCategory, '_id'>>({
    name: '',
    description: '',
    categoryId: '',
  });
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  useEffect(() => {
    // Fetch all categories on component mount
    const fetchCategories = async () => {
      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL+'/api/category');
      setCategories(response.data.categories); // Adjust based on API response
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      // Fetch subcategories when a category is selected
      const fetchSubCategories = async () => {
        const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL+`/api/sub-category/${selectedCategoryId}`);
        setSubcategories(response.data.subCategorys);
      };
      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
    setSubcategories([]); // Reset subcategories when category changes
   
    
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubCategory = async () => {
    const newSubCategory = { ...formData, categoryId: selectedCategoryId };
    const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL+'/api/sub-category', newSubCategory);
    setSubcategories([...subcategories, response.data]);
    setFormData({ name: '', description: '', categoryId: '' });
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      description: subCategory.description,
      categoryId: subCategory.categoryId,
    });
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return;
    const updatedSubCategory = { ...editingSubCategory, ...formData };
    const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL+`/api/sub-category/${editingSubCategory._id}`, updatedSubCategory);
    setSubcategories(
      subcategories.map((sub) =>
        sub._id === editingSubCategory._id ? response.data : sub
      )
    );
    setEditingSubCategory(null);
    setFormData({ name: '', description: '', categoryId: '' });
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    await axios.delete(`/api/sub-category/${subCategoryId}`);
    setSubcategories(subcategories.filter((sub) => sub._id !== subCategoryId));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category & Subcategory Management</h1>

      {/* Category Selector */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Select Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="" disabled>
            -- Select a Category --
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategories */}
      {selectedCategoryId && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Subcategories</h2>
            {subcategories.length === 0 ? (
              <p className="text-gray-500">No subcategories available for this category.</p>
            ) : (
              <ul className="space-y-4">
                {subcategories.map((subCategory,index) => (
                  <li key={subCategory._id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{(index+1)+" "+subCategory.name}</h3>
                      <p className="text-sm text-gray-500">{subCategory.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSubCategory(subCategory)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubCategory(subCategory._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add/Edit Subcategory Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingSubCategory ? handleUpdateSubCategory() : handleAddSubCategory();
              }}
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {editingSubCategory ? 'Update Subcategory' : 'Add Subcategory'}
                </button>
                {editingSubCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubCategory(null);
                      setFormData({ name: '', description: '', categoryId: '' });
                    }}
                    className="ml-4 text-gray-600 underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

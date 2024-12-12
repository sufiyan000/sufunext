"use client";
import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input,  Popconfirm, message } from 'antd';
import { Button } from '../../button';

import axios from 'axios';
import Link from 'next/link';
interface Category {
  _id: string;
  name: string;
  description: string;
}

const AddCategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);


  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data.categories); // Adjust based on your API response
      } catch (error) {
        message.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

 
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axios.delete(`/api/category/${categoryId}`);
      setCategories(categories.filter((cat) => cat._id !== categoryId));
      message.success('Category deleted successfully');
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Category) => (
        <div className="flex space-x-2">
          <button>
            Edit
          </button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button>
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <div className="flex gap-2">
      <Button><Link href={"/dashboard/category/add"}>Add Category</Link></Button>
      <Button><Link href={"/dashboard/category/sub-category"}>Sub-Category</Link></Button>
      </div>

      {/* Category List Table */}
      <Table
        dataSource={categories}
        columns={columns}
        rowKey={(record) => record._id}
      />

    
    </div>
  );
};

export default AddCategoryForm;

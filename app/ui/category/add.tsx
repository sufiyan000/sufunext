'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

interface Category {
  id: number;
  name: string;
  description: string;
}

const AddCategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const onFinish = (values: { name: string; description: string }) => {
    const newCategory: Category = {
      id: Date.now(), // Unique ID based on timestamp
      name: values.name,
      description: values.description,
    };
    setCategories([...categories, newCategory]); // Add the new category to the list
    message.success('Category added successfully!');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="p-4 border rounded-md shadow-sm bg-white"
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter the category name' },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please enter the category description' },
          ]}
        >
          <Input.TextArea placeholder="Enter category description" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCategoryForm;

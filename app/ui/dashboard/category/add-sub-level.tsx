"use client";
import { useState, useEffect } from "react";
import api from '@/app/lib/axiosClient';
interface Category {
  _id: string;
  name: string;
  description: string;
}
interface SubCategory {
  _id: string;
  name: string;
}

interface AddSubCategoryFormProps {
  category: Category[]; // Array of category objects
}
const AddSubLevelForm: React.FC<AddSubCategoryFormProps> = ({category}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]); // List of sub-categories
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [subLevel, setSubLevel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>("");

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
        setThumbnail(data.fileUrl)
        if (response.ok) {
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

  useEffect(() => {
    // Fetch the sub-categories for the selected category
    const fetchSubCategories = async () => {
      if (selectedCategory) {
        try {
          const response = await api.get(`/api/sub-category/${selectedCategory}`);
          setSubCategory(response.data.subCategorys || []);
        } catch (error) {
          console.error("Error fetching sub-categories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory || !subLevel || !description || !thumbnail) {
      alert("Please fill in all fields.");
      return;
    }

    // API call to save the sub-level
    try {
      const data = {
        subCategoryId: selectedSubCategory,
        name: subLevel,
        description,
        image: thumbnail,
      };
      const response = await api.post("/api/sub-levels", data);
      console.log(response);

      if (response.data.status === "success") {
        alert("Sub-level added successfully!");
        setSubLevel("");
        setDescription("");
      } else {
        alert("Error: Failed to add sub-level");
      }
    } catch (error) {
      alert("An error occurred while adding the sub-level.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Add Sub-Level
        </h2>
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
                    {thumbnail && (
                      <div className="mt-4">
                        <p className="text-sm text-green-500">Uploaded Image:</p>
                       <img src={thumbnail}/>
                      </div>
                    )}
                  </div>
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
           {/* Sub-Category Selection */}
           {selectedCategory && subCategory.length > 0 && (
            <div className="mb-4">
              <label
                htmlFor="subCategory"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Sub-Category
              </label>
              <select
                id="subCategory"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  -- Choose a sub-category --
                </option>
                {subCategory.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sub-Category Input */}
          <div className="mb-4">
            <label
              htmlFor="subCategory"
              className="block text-gray-700 font-medium mb-2"
            >
              Sub-level Name
            </label>
            <input
              id="subLevel"
              type="text"
              value={subLevel}
              onChange={(e) => setSubLevel(e.target.value)}
              placeholder="Enter sub-Level name"
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

export default AddSubLevelForm;

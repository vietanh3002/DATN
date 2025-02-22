/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any>([
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response: any = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleDelete = async (id: number | null) => {
    if (!id) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Categories</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
          className="flex-grow p-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={handleCreate}
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Create
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map((category: any) => (
          <li
            key={category.id}
            className="flex justify-between items-center p-2 border border-gray-300 rounded"
          >
            {category.name}
            <button
              onClick={() => {
                setShowConfirm(true);
                setDeleteId(category.id);
              }}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="mb-4">
              Are you sure you want to delete this category?
            </p>
            <button
              onClick={() => {
                handleDelete(deleteId);
                setShowConfirm(false);
              }}
              className="p-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

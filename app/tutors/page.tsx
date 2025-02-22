/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import TutorCard from "../components/tutors/tutor-card";

const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [tutors, setTutors] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const getTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/public/tutors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTutors(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching courses", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTutors();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gia Sư</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        {/* Tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm gia sư..."
          className="border border-gray-300 p-2 rounded w-full mb-4 sm:mb-0 sm:mr-4 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Lọc theo lĩnh vực */}
        <select
          className="border border-gray-300 p-2 rounded mb-4 sm:mb-0 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả lĩnh vực</option>
          <option value="Công nghệ thông tin">Công nghệ thông tin</option>
          <option value="Ngôn ngữ">Ngôn ngữ</option>
          <option value="Khoa học">Khoa học</option>
        </select>

        {/* Lọc theo đánh giá */}
        <select
          className="border border-gray-300 p-2 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Tất cả đánh giá</option>
          <option value="4.5">Từ 4.5 ⭐ trở lên</option>
          <option value="4.0">Từ 4.0 ⭐ trở lên</option>
        </select>
      </div>

      {/* Danh sách gia sư */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
        ) : tutors.length > 0 ? (
          tutors.map((tutor: any) => <TutorCard key={tutor.id} tutor={tutor} />)
        ) : (
          <p className="text-center text-gray-600">
            Không tìm thấy gia sư phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tutors;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Course {
  id: number;
  type: string;
  title: string;
  videoIntro: string;
  thumbnail: string;
  maximumQuantity: number;
  pricePer: number;
  description: string;
  otherInfo: string;
  status: string;
  totalRate: number;
  user: {
    username: string;
    email: string;
  };
}

function TutorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [courses, setCourses] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/public/tutor-courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching courses", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Khóa Học Gia Sư</h1>

      {/* Tìm kiếm và bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded w-full mb-4 sm:mb-0 sm:mr-4 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm khóa học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 rounded mb-4 sm:mb-0 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Hiển thị danh sách khóa học */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
        ) : courses.length > 0 ? (
          courses.map((course: any) => (
            <CourseItem key={course.id} course={course} />
          ))
        ) : (
          <p className="text-center text-gray-600">
            Không tìm thấy khóa học phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}

function CourseItem({ course }: { course: Course }) {
  const router = useRouter();
  return (
    <div
      // href={`/tutor-courses/${course.id}`}
      className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => { router.push(`/tutor-courses/${course.id}`) }}
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover transition duration-300 transform hover:scale-110"
      />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-900">Gia sư: {course.user.username}</p>
        <p className="text-gray-900">Email: {course.user.email}</p>
        <p className="text-gray-900 font-bold">
          Giá: {course.pricePer}VND/buổi
        </p>
        <p className="text-gray-600">
          Loại: {course.type === "online" ? "Online" : "Offline"}
        </p>
        <p className="text-gray-600">
          Số lượng tối đa: {course.maximumQuantity}
        </p>
        <p className="text-yellow-500 font-bold">
          Đánh giá: {course.totalRate} ★
        </p>
        <Link
          href={course.videoIntro}
          className="block text-blue-600 mt-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Xem video giới thiệu
        </Link>
      </div>
    </div>
  );
}

export default TutorCoursesPage;

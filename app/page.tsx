/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import CourseCard from "./components/courses/course-card";
import TutorCard from "./components/tutors/tutor-card";
import { useEffect, useState } from "react";




export default function Home() {



  const [tutors, setTutors] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const getTutors = async () => {
    try {
      const response = await fetch("/api/public/tutors?limit=3&page=1", {
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
    }
  };
  const getCourses = async () => {
    try {
      const response = await fetch("/api/public/courses?limit=3&page=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCourses(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching courses", error.message);
    }
  };
  useEffect(() => {
    getTutors();
    getCourses();
  }, []);
  return (
    <div className="">
      <section className="bg-blue-600 text-white py-20 shadow-lg rounded-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 transition-transform transform hover:scale-105 font-Arial">
            Tìm Khóa Học và Gia Sư Phù Hợp Nhất Cho Bạn
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            Học trực tuyến với các khóa học chất lượng từ các gia sư hàng đầu.
            Đăng ký ngay để khám phá hành trình học tập của bạn.
          </p>
          <div>
            <Link
              href="/courses"
              className="px-8 py-4 bg-white text-blue-600 rounded-full mr-4 hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Tìm Khóa Học
            </Link>
            <Link
              href="/tutors"
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Tìm Gia Sư
            </Link>
          </div>
        </div>
      </section>

      {/* Khóa học nổi bật */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Khóa Học Nổi Bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.length > 0 &&
              courses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>
      </section>

      {/* Gia sư nổi bật */}
      <section className="py-16 bg-gray-100 rounded-lg shadow-md">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Gia Sư Nổi Bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {tutors.map((tutor: any) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto text-center text-gray-600">
          &copy; 2024 CourseTutor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManagerCourses = () => {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tutors/courses`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCourses(data.data);
      } else {
        console.error("Failed to get courses.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);
  return (
    <div>
      <div className="flex justify-end mr-3">
        <Link href="/manage/manage-courses/create" className="">
          <Button>+ Tạo khóa học mới</Button>
        </Link>
      </div>
      <div className="text-3xl flex justify-center font-bold">
        Danh sách khóa học
      </div>
      <div className="px-6">
        <Table>
          <TableCaption>A list of your courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>UnitPrice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <div>Loading...</div>
            ) : (
              courses.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>{course.unitPrice}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    <Link href={`/manage/manage-courses/${course.id}`}>
                      <Button>+</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManagerCourses;

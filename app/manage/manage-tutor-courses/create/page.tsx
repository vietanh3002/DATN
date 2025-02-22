/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Create = () => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [course, setCourse] = useState({
    type: "online",
    title: "",
    pricePer: 0,
    maximumQuantity: 0,
    status: "draft",
    description: "",
    otherInfo: "",
    videoIntro: "",
    thumbnail: "",
    categoryIds: [],
  });

  const getCategories = async () => {
    try {
      const response = await fetch("/api/public/categories");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCategories(data.data);
      } else {
        console.error("Failed to get categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourse({ ...course, [name]: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const handleChangeStatus = (e: string) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      status: e,
    }));
  };

  const handleChangeType = (e: string) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      type: e,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tutors/tutor-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token}`,
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        alert("Tạo khóa học thành công");
        setCourse({
          type: "online",
          title: "",
          pricePer: 0,
          maximumQuantity: 0,
          status: "draft",
          description: "",
          otherInfo: "",
          videoIntro: "",
          thumbnail: "",
          categoryIds: [],
        });
      } else {
        console.error("Failed to create course.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  console.log(course);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price/session
          </label>
          <Input
            id="price"
            name="pricePer"
            type="number"
            value={course.pricePer}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="unitPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Maximum quantity
          </label>
          <Input
            id="maximumQuantity"
            name="maximumQuantity"
            type="number"
            value={course.maximumQuantity}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <Select
            name="type"
            required
            onValueChange={handleChangeType}
            value={course.type}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <Select
            name="status"
            required
            onValueChange={handleChangeStatus}
            value={course.status}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={course.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="otherInfo"
            className="block text-sm font-medium text-gray-700"
          >
            Other Info
          </label>
          <Textarea
            id="otherInfo"
            name="otherInfo"
            value={course.otherInfo}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="videoIntro"
            className="block text-sm font-medium text-gray-700"
          >
            Video Intro
          </label>
          <Input
            id="videoIntro"
            name="videoIntro"
            value={course.videoIntro}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Thumbnail
          </label>
          <Input
            id="thumbnail"
            name="thumbnail"
            onChange={handleChange}
            className="mt-1 block w-full"
            type="file"
          />
        </div>
        <div>
          <label
            htmlFor="categoryIds"
            className="block text-sm font-medium text-gray-700"
          >
            Categories
          </label>
          {categories.map((c: any) => {
            return (
              <div className="flex items-center space-x-2 py-1" key={c.id}>
                <Checkbox
                  id={`${c.id}`}
                  checked={course.categoryIds.includes(c.id as never)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setCourse({
                          ...course,
                          categoryIds: [...course.categoryIds, c.id as never],
                        })
                      : setCourse({
                          ...course,
                          categoryIds: course.categoryIds.filter(
                            (id) => id !== (c.id as never)
                          ),
                        });
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {c.name}
                </label>
              </div>
            );
          })}
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Create;

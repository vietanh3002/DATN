/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Lesson {
  id: number;
  title: string;
  order: number;
  linkVideo: string;
  description: string;
}

interface Chapter {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface User {
  id: number;
  username: string;
  email: string;
}
interface UserCourse {
  id: number;
  user: User;
  status: string;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  videoIntro: string;
  thumbnail: string;
  price: number;
  unitPrice: number;
  status: string;
  categoryCourses: {
    category: { name: string };
  }[];
  chapters: Chapter[];
  userCourses: UserCourse[];
}

const Detail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chapters, setChapters] = useState<string[]>([]);
  const [chapter, setChapter] = useState<string>("");
  const [openStudents, setOpenStudents] = useState<boolean>(false);
  const [students, setStudents] = useState<UserCourse[] | null>(null);
  const [student, setStudent] = useState({
    username: "",
    email: "",
  });
  const getDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tutors/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDetail(data.data);
        setStudents(data.data.userCourses);
      } else {
        console.error("Failed to get course.");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDetail();
  }, [id])

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    return ampersandPosition !== -1
      ? `https://www.youtube.com/embed/${videoId.substring(
        0,
        ampersandPosition
      )}`
      : `https://www.youtube.com/embed/${videoId}`;
  };

  const handleAddChapters = async () => {
    const response = await fetch(`/api/tutors/courses/${id}/chapters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any)?.token}`,
      },
      body: JSON.stringify({ titles: chapters }),
    });
    if (response.ok) {
      await getDetail();
      setChapters([]);
      setChapter("");
    } else {
      console.error("Failed to add chapter.");
    }
  };

  const handleAddStudent = async () => {
    const response = await fetch(`/api/tutors/courses/${id}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any)?.token}`,
      },
      body: JSON.stringify(student),
    });
    if (response.ok) {
      await getDetail();
      alert("Student added successfully");
      setStudent({ username: "", email: "" });
    } else {
      console.error("Failed to add student.");
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    const response = await fetch(`/api/tutors/courses/${id}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any)?.token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      if (students) {
        setStudents(
          students?.map((i) => {
            if (i.id === id) {
              return { ...i, status };
            }
            return i;
          })
        );
      }
    } else {
      console.error("Failed to update student status.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="px-4">
          <div className="flex justify-end gap-4">
            <Button onClick={() => setOpenStudents((prev) => !prev)}>
              Students
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>+ Add student</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add student</DialogTitle>
                </DialogHeader>
                <div>
                  <label htmlFor="username" className="mt-3">
                    User Name
                  </label>
                  <Input
                    id="username"
                    value={student.username}
                    onChange={(e) =>
                      setStudent({ ...student, username: e.target.value })
                    }
                    className="col-span-3"
                  />
                  <label htmlFor="email" className="mt-3">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={student.email}
                    onChange={(e) =>
                      setStudent({ ...student, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddStudent}>
                    Add student
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {openStudents && (
            <Table>
              <TableCaption>A list of students.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ChangeStatus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students &&
                  students.length > 0 &&
                  students.map((student) => {
                    return (
                      <TableRow key={student.user.id}>
                        <TableCell>{student.user.username}</TableCell>
                        <TableCell>{student.user.email}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleChangeStatus(
                                student.id,
                                student.status === "active"
                                  ? "inactive"
                                  : "active"
                              );
                            }}
                          >
                            Change Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
          <h1 className="text-3xl font-bold mb-4">{detail?.title}</h1>
          <p className="text-gray-700 mb-4">{detail?.description}</p>
          <div className="mb-4">
            <img
              src={detail?.thumbnail}
              alt={detail?.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="mb-4">
            <span className="font-semibold">Price: </span>
            {detail?.price}VND
          </div>
          <div className="mb-4">
            <span className="font-semibold">Unit Price: </span>
            {detail?.unitPrice}VND
          </div>
          <div className="mb-4">
            <span className="font-semibold">Status: </span>
            {detail?.status}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Categories: </span>
            {detail?.categoryCourses.map((categoryCourse, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {categoryCourse.category.name}
              </span>
            ))}
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Video Introduction</h2>
            {detail?.videoIntro && (
              <iframe
                width="100%"
                height="600"
                src={getYouTubeEmbedUrl(detail.videoIntro)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Introduction"
                className="rounded-lg"
              ></iframe>
            )}
          </div>
          <div className="pb-20">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-2">Chapters</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>+ add chapters</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add chapters</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1">
                    {chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 rounded-full px-3 py-1 my-2 text-sm font-semibold text-gray-700 mr-2 w-fit flex items-center"
                      >
                        <span>{chapter}</span>
                        <div
                          className="px-2 py-1 ml-2 rounded-full bg-red-500 cursor-pointer"
                          onClick={() => {
                            const newChapters = chapters.filter(
                              (item) => item !== chapter
                            );
                            setChapters(newChapters);
                          }}
                        >
                          x
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-4 py-4">
                    <form
                      className="grid grid-cols-4 items-center gap-4"
                      onSubmit={(e: any) => {
                        e.preventDefault();
                        setChapters([...chapters, chapter]);
                        setChapter("");
                      }}
                    >
                      <label htmlFor="name" className="text-right">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
                        className="col-span-3"
                      />
                    </form>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddChapters}>
                      Add chapters
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {detail?.chapters.sort((a: any, b: any) => a.order - b.order).map((chapter, index) => (
                <AccordionItem value={String(chapter.order)} key={index}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full">
                      <span>{chapter.title}</span>
                      <Link href={`/manage/manage-courses/${id}/${chapter.id}`}>
                        <Button>+</Button>
                      </Link>
                    </div>
                  </AccordionTrigger>
                  {chapter.lessons.sort((a: any, b: any) => a.order - b.order).map((lesson, index) => {
                    return (
                      <AccordionContent key={index}>
                        <Link
                          href={`/manage/manage-courses/${id}/${chapter.id}/${lesson.id}`}
                        >
                          {lesson.title}
                        </Link>
                      </AccordionContent>
                    );
                  })}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;

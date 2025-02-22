/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import formatDateTime from "@/app/lib/formatDate";
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
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

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

interface Session {
  id: number;
  tutoringDay: string;
  startTime: string;
  linkMeet: string;
  studyStatus: string;
  document: string;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  videoIntro: string;
  thumbnail: string;
  pricePer: number;
  maximumQuantity: number;
  status: string;
  categoryTutorCourses: {
    category: { name: string };
  }[];
  tutoringSessions: Session[];
  userTutorCourses: UserCourse[];
}

const Detail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openStudents, setOpenStudents] = useState<boolean>(false);
  const [students, setStudents] = useState<UserCourse[] | null>(null);
  const [student, setStudent] = useState({
    username: "",
    email: "",
  });
  const [tutoringSession, setTutoringSession] = useState({
    tutoringDay: "",
    startTime: "",
    linkMeet: "",
    document: "",
  });
  const getDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tutors/tutor-courses/${id}`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDetail(data.data);
        setStudents(data.data.userTutorCourses);
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
  }, [id]);
  console.log(detail);

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

  const handleAddStudent = async () => {
    const response = await fetch(`/api/tutors/tutor-courses/${id}/students`, {
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

  const handleAddSession = async () => {
    const response = await fetch(`/api/tutors/tutor-courses/${id}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any)?.token}`,
      },
      body: JSON.stringify(tutoringSession),
    });
    if (response.ok) {
      await getDetail();
      alert("Session added successfully");
      setTutoringSession({
        tutoringDay: "",
        startTime: "",
        linkMeet: "",
        document: "",
      });
    } else {
      console.error("Failed to add session.");
    }
  };

  console.log(tutoringSession);

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
            {detail?.pricePer}VND
          </div>
          <div className="mb-4">
            <span className="font-semibold">Maximum quantity: </span>
            {detail?.maximumQuantity}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Status: </span>
            {detail?.status}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Categories: </span>
            {detail?.categoryTutorCourses.map((categoryCourse, index) => (
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
              <h2 className="text-2xl font-bold mb-2">Sessions</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>+ add session</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add session</DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-4 py-4">
                    <div>
                      <label htmlFor="time" className="text-right">
                        Time
                      </label>
                      <div>
                        <Datetime
                          className=""
                          //   value={`${tutoringSession.tutoringDay} ${tutoringSession.startTime}`}
                          onChange={(e) => {
                            const { date, time } = formatDateTime(
                              e.toLocaleString()
                            );
                            setTutoringSession({
                              ...tutoringSession,
                              startTime: time,
                              tutoringDay: date,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="meet" className="text-right">
                        Meet
                      </label>
                      <Input
                        id="meet"
                        value={tutoringSession.linkMeet}
                        onChange={(e) =>
                          setTutoringSession({
                            ...tutoringSession,
                            linkMeet: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div>
                      <label htmlFor="document" className="text-right">
                        Document
                      </label>
                      <Textarea
                        id="document"
                        value={tutoringSession.document}
                        onChange={(e) =>
                          setTutoringSession({
                            ...tutoringSession,
                            document: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" onClick={handleAddSession}>
                      Add session
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableCaption>A list of sessions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Buổi</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link Meet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail?.tutoringSessions.map((session, index) => (
                  <TableRow key={session.id}>
                    <TableCell>Buổi {index + 1}</TableCell>
                    <TableCell>{session.tutoringDay}</TableCell>
                    <TableCell>{session.startTime}</TableCell>
                    <TableCell>{session.studyStatus}</TableCell>
                    <TableCell>
                      <Link
                        href={session.linkMeet}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {session.linkMeet}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;

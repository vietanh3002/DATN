/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Home = () => {
  const { data: session } = useSession();
  const [requestTutors, setRequestTutors] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getRequestTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admins/user-requests`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRequestTutors(data.data);
      }
    } catch (error) {
      console.error("Error fetching request tutors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (id: number, type: "accept" | "reject") => {
    try {
      const response = await fetch(`/api/admins/user-requests/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${(session as any)?.token}`,
        },
        body: JSON.stringify({ role: type === "accept" ? "tutor" : "user" }),
      });
      if (response.ok) {
        await getRequestTutors();
      } else {
        alert("Error sending request!");
      }
    } catch (error) {
      console.error("Error handling request tutor", error);
    }
  };

  useEffect(() => {
    if ((session as any).token) {
      getRequestTutors();
    }
  }, [session]);
  if (!(session as any)?.user?.role) {
    return <div>Loading...</div>;
  }
  console.log(requestTutors);
  return (
    <div className="w-full flex justify-center px-10">
      <Table className="w-full">
        <TableCaption>A list of request tutors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Detail</TableHead>
            <TableHead>UserName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Accept</TableHead>
            <TableHead>Reject</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <div>Loading...</div>
          ) : (
            requestTutors.length > 0 &&
            requestTutors.map((tutor: any) => (
              <TableRow key={tutor.id}>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>+</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Detail</DialogTitle>
                      </DialogHeader>
                      <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="cursor-pointer w-24 h-24">
                            <AvatarImage
                              src={
                                tutor.avatar ||
                                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                              }
                              className="w-24 h-24"
                            />
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold">
                              {tutor.username}
                            </h2>
                            <p className="text-gray-600">{tutor.email}</p>
                            <p className="text-gray-600">{tutor.role}</p>
                          </div>
                        </div>
                        {tutor.requestTutor && (
                          <div className="mt-4">
                            <h3 className="text-xl font-semibold">
                              Tutor Details
                            </h3>
                            <p>
                              <strong>Proposed Courses:</strong>{" "}
                              {tutor.requestTutor.proposedCourses}
                            </p>
                            <p>
                              <strong>Expertise:</strong>{" "}
                              {tutor.requestTutor.expertise}
                            </p>
                            <p>
                              <strong>Experience:</strong>{" "}
                              {tutor.requestTutor.experience}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{tutor.username}</TableCell>
                <TableCell>{tutor.email}</TableCell>
                <TableCell>{tutor.role}</TableCell>
                <TableCell>
                  <Button
                    className="bg-green-700 hover:bg-green-800"
                    onClick={() => handleChange(tutor.id, "accept")}
                  >
                    Accept
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-red-700 hover:bg-red-800"
                    onClick={() => handleChange(tutor.id, "reject")}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;

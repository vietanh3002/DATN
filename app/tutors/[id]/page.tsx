"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TutorDetail {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar: string;
  requestTutor?: {
    proposedCourses: string;
    expertise: string;
    experience: string;
  } | null;
}

const TutorDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState<TutorDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/public/tutors/${id}`);
      const data = await response.json();
      if (response.ok) {
        setDetail(data.data);
      } else {
        setError(data.meta.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {detail ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="cursor-pointer w-24 h-24">
              <AvatarImage
                src={
                  detail.avatar ||
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                }
                className="w-24 h-24"
              />
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{detail.username}</h2>
              <p className="text-gray-600">{detail.email}</p>
              <p className="text-gray-600">{detail.role}</p>
            </div>
          </div>
          {detail.requestTutor && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Tutor Details</h3>
              <p>
                <strong>Proposed Courses:</strong>{" "}
                {detail.requestTutor.proposedCourses}
              </p>
              <p>
                <strong>Expertise:</strong> {detail.requestTutor.expertise}
              </p>
              <p>
                <strong>Experience:</strong> {detail.requestTutor.experience}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>{error || "Loading..."}</p>
      )}
    </div>
  );
};

export default TutorDetail;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Lesson {
  title: string;
  linkVideo: string;
  description: string;
}

const LessonDetail = () => {
  const { chapterId, id, lessonId } = useParams();
  const { data: session } = useSession();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const getLesson = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/tutors/chapters/${chapterId}/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLesson(data.data);
      } else {
        console.error("Failed to get lesson.");
      }
    } catch (error) {
      console.error("Error getting lesson:", error);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    getLesson();
  }, [chapterId, lessonId, id]);
  return (
    <div className="p-4 mx-auto">
      <Link href={`/manage/manage-courses/${id}`}>
        <Button className="mb-4">Back</Button>
      </Link>
      {loading ? (
        <p className="text-center text-gray-500">Loading lesson...</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4">{lesson?.title}</h2>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Video Introduction</h2>
            {lesson && lesson.linkVideo && (
              <iframe
                width="100%"
                height="600"
                src={getYouTubeEmbedUrl(lesson.linkVideo)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Introduction"
                className="rounded-lg"
              ></iframe>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Description</h3>
            <p>{lesson?.description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonDetail;

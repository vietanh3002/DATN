/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

interface Lesson {
  title: string;
  linkVideo: string;
  description: string;
}

const ChapterCreateLesson = () => {
  const { chapterId, id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [lesson, setLesson] = useState<Lesson>({
    title: "",
    linkVideo: "",
    description: "",
  });
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
  const handleSaveLesson = async () => {
    try {
      const response = await fetch(
        `/api/tutors/chapters/${chapterId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.token}`,
          },
          body: JSON.stringify(lesson),
        }
      );
      if (response.ok) {
        alert("Lesson created successfully!");
        setLesson({
          title: "",
          linkVideo: "",
          description: "",
        });
        router.push(`/manage/manage-courses/${id}`);
      } else {
        console.error("Failed to create lesson.");
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };
  return (
    <div className="p-4 mx-auto">
      <input
        type="text"
        placeholder="Lesson Title"
        value={lesson.title}
        onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        placeholder="Video Link"
        value={lesson.linkVideo}
        onChange={(e) => setLesson({ ...lesson, linkVideo: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Video Introduction</h2>
        {lesson.linkVideo && (
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
      <textarea
        placeholder="Description"
        value={lesson.description}
        onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSaveLesson}
        className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
      >
        Add Lesson
      </button>
      <Link href={`/manage/manage-courses/${id}`}>
        <Button className="w-full">Back to Chapter</Button>
      </Link>
    </div>
  );
};

export default ChapterCreateLesson;

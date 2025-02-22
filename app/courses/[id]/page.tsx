/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter");
  const lessonId = searchParams.get("lesson");
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<boolean>(false);
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const getCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token ? (session as any)?.token : ""
            }`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCourse(data.data.course);
        setOwner(data.data.owner);
      }
    } catch (error: any) {
      console.error("Error fetching course", error.message);
    } finally {
      setLoading(false);
    }
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
    getCourse();
  }, [id, session]);
  useEffect(() => {
    if (chapterId && lessonId && owner && course) {
      const chapterIndex = course.chapters.findIndex(
        (chapter: any) => chapter.id === parseInt(chapterId)
      );
      if (chapterIndex !== -1) {
        const lesson = course.chapters[chapterIndex].lessons.find(
          (l: any) => l.id === parseInt(lessonId)
        );
        if (lesson) {
          setLesson(lesson);
        }
      }
    }
  }, [chapterId, course, lessonId, owner]);
  console.log(lesson);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-6 mx-6">
          <div className="flex-[4]">
            {lesson && owner ? (
              <>
                {lesson?.linkVideo && (
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
                <h2 className="text-3xl font-bold mb-4">{lesson?.title}</h2>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Description</h3>
                  <p>{lesson?.description}</p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <p className="text-gray-700 mb-4">{course?.description}</p>
                <div className="mb-4">
                  <span className="font-semibold">Price: </span>
                  {course?.price}VND
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Unit Price: </span>
                  {course?.unitPrice}VND
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Status: </span>
                  {course?.status}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Categories: </span>
                  {course?.categoryCourses.map(
                    (categoryCourse: any, index: number) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                      >
                        {categoryCourse.category.name}
                      </span>
                    )
                  )}
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">
                    Video Introduction
                  </h2>
                  {course?.videoIntro && (
                    <iframe
                      width="100%"
                      height="600"
                      src={getYouTubeEmbedUrl(course.videoIntro)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video Introduction"
                      className="rounded-lg"
                    ></iframe>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex-[1]">
            <Accordion type="single" collapsible className="w-full">
              {course.chapters.length > 0 &&
                course.chapters
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((c: any) => {
                    return (
                      <AccordionItem value={`${c.id}`} key={c.id}>
                        <AccordionTrigger>{c.title}</AccordionTrigger>
                        <AccordionContent>
                          {c.lessons
                            .sort((a: any, b: any) => a.id - b.id)
                            .map((l: any) => (
                              <div
                                key={l.id}
                                onClick={() => {
                                  if (owner) {
                                    router.push(
                                      `/courses/${id}?chapter=${c.id}&lesson=${l.id}`
                                    );
                                    setLesson(l);
                                  }
                                }}
                                className="py-1 border-b cursor-pointer"
                              >
                                {l.title}
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

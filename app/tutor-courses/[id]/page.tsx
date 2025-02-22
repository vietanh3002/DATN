"use client";

import formatDateTime from "@/app/lib/formatDate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TutorCourseDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<boolean>(false);
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const getCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/tutor-courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as any)?.token ? (session as any)?.token : ""
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
  console.log(lesson);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-6 mx-6">
          <div className="flex-[4]">
            <>
              <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
              <p className="text-gray-700 mb-4">{course?.description}</p>
              <div className="mb-4">
                <span className="font-semibold">Price/Session: </span>
                {course?.pricePer}VND
              </div>
              <div className="mb-4">
                <span className="font-semibold">Maximum Quantity: </span>
                {course?.maximumQuantity}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Status: </span>
                {course?.status}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Categories: </span>
                {course?.categoryTutorCourses.map(
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
                <h2 className="text-2xl font-bold mb-2">Video Introduction</h2>
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
          </div>
          <div className="flex-[1]">
            <Accordion type="single" collapsible className="w-full">
              {course &&
                course?.tutoringSessions.length > 0 &&
                course.tutoringSessions.map((c: any) => {
                  return (
                    <AccordionItem value={`${c.id}`} key={c.id}>
                      <AccordionTrigger>
                        {formatDateTime(c.tutoringDay).date + " " + c.startTime}
                      </AccordionTrigger>
                      <AccordionContent>
                        {owner && (
                          <>
                            <div>
                              <h3>Link Meeting:</h3>
                              <a href={c.linkMeet} target="_blank">
                                {c.linkMeet}
                              </a>
                            </div>
                            <div>
                              <h3>Document:</h3>
                              <div>{c.document}</div>
                            </div>
                          </>
                        )}
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

export default TutorCourseDetail;

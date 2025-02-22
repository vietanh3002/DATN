/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  if (!(session as any)?.user?.role) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto flex py-12 w-screen">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Profile
          </h1>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Thông tin cá nhân
            </Link>
            {(session as any).user?.role === "tutor" ? (
              <>
                <Link
                  href="/manage/manage-courses"
                  className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Quản Lý Khóa Học
                </Link>
                <Link
                  href="/manage/manage-tutor-courses"
                  className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Quản Lý Khóa Gia Sư
                </Link>
              </>
            ) : (
              <Link
                href="/profile/become-tutor"
                className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Xin Quyền Làm Gia Sư
              </Link>
            )}
          </nav>
        </div>
        <div className="flex-grow bg-white shadow-md rounded-lg p-6 ml-0 md:ml-4">
          {children}
        </div>
      </div>
    </div>
  );
}

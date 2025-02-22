/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { SignIn } from "./sign-in";
import SignOut from "./sign-out";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/app/assets/logo.png";
import { AiFillHome } from "react-icons/ai";
import { MdContactMail, MdVideoLibrary } from "react-icons/md";
import { FaChalkboardTeacher, FaFileVideo } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import SignUp from "./sign-up";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const [authentication, setAuthentication] = useState<boolean>(true);
  const path = usePathname();
  const [pathname, setPathname] = useState<string>("/");

  useEffect(() => {
    setPathname(path);
  }, [path]);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-16 gap-4 md:gap-10 justify-between items-center px-4 md:px-8 border-b-2 bg-white shadow-md sticky top-0 z-[9999]">
      <div className="flex justify-center w-full md:w-auto">
        <Link href="/"><Image src={logo.src} width={60} height={60} alt="logo" /></Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
        <div
          className={`flex gap-2 items-center font-semibold h-full px-4 transition-colors duration-300 ease-in-out ${pathname === "/"
            ? "border-b-4 border-blue-700 text-blue-700"
            : "hover:text-blue-500"
            }`}
        >
          <AiFillHome className="w-5 h-5" />
          <Link href="/">Trang chủ</Link>
        </div>
        <div
          className={`flex gap-2 items-center font-semibold h-full px-4 transition-colors duration-300 ease-in-out ${pathname === "/courses"
            ? "border-b-4 border-blue-700 text-blue-700"
            : "hover:text-blue-500"
            }`}
        >
          <MdVideoLibrary className="w-5 h-5" />
          <Link href="/courses">Khóa học</Link>
        </div>
        <div
          className={`flex gap-2 items-center font-semibold h-full px-4 transition-colors duration-300 ease-in-out ${pathname === "/tutor-courses"
            ? "border-b-4 border-blue-700 text-blue-700"
            : "hover:text-blue-500"
            }`}
        >
          <FaFileVideo className="w-5 h-5" />
          <Link href="/tutor-courses">Khóa gia sư</Link>
        </div>
        <div
          className={`flex gap-2 items-center font-semibold h-full px-4 transition-colors duration-300 ease-in-out ${pathname === "/tutors"
            ? "border-b-4 border-blue-700 text-blue-700"
            : "hover:text-blue-500"
            }`}
        >
          <FaChalkboardTeacher className="w-5 h-5" />
          <Link href="/tutors">Gia sư</Link>
        </div>
        <div
          className={`flex gap-2 items-center font-semibold h-full px-4 transition-colors duration-300 ease-in-out ${pathname === "/contact"
            ? "border-b-4 border-blue-700 text-blue-700"
            : "hover:text-blue-500"
            }`}
        >
          <MdContactMail className="w-5 h-5" />
          <Link href="/contact">Liên hệ</Link>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center w-full md:w-auto">
        {!session ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex gap-4">
                <Button
                  variant="default"
                  className="rounded-full px-8"
                  onClick={() => setAuthentication(true)}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="rounded-full px-8 bg-[#ff5117] hover:bg-[#ff480b]"
                  onClick={() => setAuthentication(false)}
                >
                  Sign Up
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center text-4xl">
                  {authentication ? "Sign In" : "Sign Up"}
                </DialogTitle>
                <DialogDescription className="flex justify-center">
                  {authentication ? "Sign In " : "Sign Up "} with us.
                </DialogDescription>
              </DialogHeader>
              {authentication ? (
                <SignIn setAuthentication={setAuthentication} />
              ) : (
                <SignUp setAuthentication={setAuthentication} />
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <h1 className="font-bold">Welcome, {session.user?.name}!</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      session.user?.image ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    }
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 px-6 py-6 min-h-20 mr-6 min-w-fit">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-light">
                      {session.user?.email}
                    </div>
                  </div>
                  <div>
                    <Avatar>
                      <AvatarImage
                        src={
                          session.user?.image ||
                          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                        }
                      />
                    </Avatar>
                  </div>
                </div>
                <div className="border" />
                <Link href="/profile">
                  <div className="py-3 px-3 mt-2 bg-[#F1F5F9] text-[18px]">
                    Thông tin cá nhân
                  </div>
                </Link>
                {(session as any)?.user?.role === "admin" && (
                  <Link href="/admins">
                    <div className="py-3 px-3 mt-2 bg-[#F1F5F9] text-[18px]">
                      Quản trị viên
                    </div>
                  </Link>
                )}
                {(session as any)?.user?.role === "tutor" && (
                  <>
                    <Link href="/manage/manage-courses">
                      <div className="py-3 px-3 mt-2 bg-[#F1F5F9] text-[18px]">
                        Quản Lý Khóa Học
                      </div>
                    </Link>
                    <Link href="/manage/manage-tutor-courses">
                      <div className="py-3 px-3 mt-2 bg-[#F1F5F9] text-[18px]">
                        Quản Lý Khóa Gia Sư
                      </div>
                    </Link>
                  </>
                )}
                <SignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

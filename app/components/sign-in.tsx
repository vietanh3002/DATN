/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import google from "@/app/assets/google.png";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function SignIn({ setAuthentication }: any) {
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const data: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (data.status !== 200) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          description: "Login failed!",
          duration: 2000,
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center px-6 gap-2 mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 w-full"
      >
        <label className="flex flex-col gap-1 w-full">
          Email
          <input
            name="email"
            type="email"
            className="w-full p-3 rounded-xl border"
          />
        </label>
        <label className="flex flex-col gap-1 w-full">
          Password
          <input
            name="password"
            type="password"
            className="w-full p-3 rounded-xl border"
          />
        </label>
        <Button
          type="submit"
          variant={"default"}
          className="w-full bg-[#2828d5] hover:bg-[#0505fb] rounded-xl p-6 mt-6"
        >
          Sign In
        </Button>
      </form>
      <p className="flex gap-1 text-sm justify-end w-full">
        Don&apos;t have an account?{" "}
        <p
          className="text-[#0505fb] cursor-pointer hover:underline"
          onClick={() => setAuthentication(false)}
        >
          Sign Up
        </p>
      </p>
      <div className="w-full">
        <span className="flex justify-center my-2">Sign In with Google</span>
        <Button
          variant="outline"
          onClick={async () => {
            await signIn("google");
          }}
          className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
        >
          <Image src={google.src} alt="google logo" width={30} height={30} />
          <p>Sign In With Google</p>
        </Button>
      </div>
    </div>
  );
}

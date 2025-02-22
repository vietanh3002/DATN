/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import google from "@/app/assets/google.png";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SignUp = ({ setAuthentication }: any) => {
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.meta.statusCode !== 201) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          description: data.meta.message,
          duration: 2000,
        });
        return;
      }
      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
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
          Username
          <input
            name="username"
            type="text"
            className="w-full p-3 rounded-xl border"
          />
        </label>
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
          Sign Up
        </Button>
      </form>
      <p className="flex gap-1 text-sm justify-end w-full">
        Already have an account?
        <p
          className="text-[#0505fb] cursor-pointer hover:underline"
          onClick={() => setAuthentication(true)}
        >
          Sign In
        </p>
      </p>
      <div className="w-full">
        <span className="flex justify-center my-2">Sign Up with Google</span>
        <Button
          variant="outline"
          onClick={async () => {
            await signIn("google");
          }}
          className="w-full rounded-xl p-6 flex justify-center  items-center gap-3"
        >
          <Image src={google.src} alt="google logo" width={30} height={30} />
          <p>Sign Up With Google</p>
        </Button>
      </div>
    </div>
  );
};

export default SignUp;

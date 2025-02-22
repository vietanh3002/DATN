import { signOut } from "next-auth/react";
import React from "react";

const SignOut = () => {
  return (
    <div className="text-lg font-medium py-3 bg-slate-100 mt-2">
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
        className="w-full flex justify-start px-4"
      >
        Sign out
      </button>
    </div>
  );
};

export default SignOut;

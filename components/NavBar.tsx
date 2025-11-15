"use client";

import { Button } from "./ui/button";
import Image from "next/image";
export function NavBar() {
  return (
    <div className="flex bg-lime-500 p-4 m-10 rounded-lg border-1 border-b-3 border-l-3 border-black text-lime-50 justify-between items-center ">
      <h1 className="text-3xl p-2 font-bold">Voluntr</h1>
      <div className="flex items-center gap-4 text-grey-100 ">
        <Button variant="ghost" className="text-xl">
          NGOs
        </Button>
        <h1 className="text-xl ">|</h1>
        <Button variant="ghost" className="text-xl">
          EVENTS
        </Button>
      </div>
      <div className="flex items-center gap-4 p-2">
        <Button>Login</Button>

        <Button>Register</Button>
      </div>
    </div>
  );
}

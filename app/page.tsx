"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className=" m-4 md:m-10 px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* LEFT SIDE */}


      
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col border border-black rounded-2xl w-full max-w-sm">
          <InputGroup>
            <InputGroupInput placeholder="Enter your location" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="font-black text-3xl md:text-4xl leading-tight">
          <p>DISCOVER CAUSES.</p>
          <p>MAKE AN IMPACT NEAR YOU.</p>
        </div>

        <p className="text-lg md:text-2xl ">
          Active Volunteer Community to Find NGOs, Join Events, and Contribute
          to Causes Around You.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex justify-center md:justify-end">
        <img
          src="/hero.png"
          alt="volunteer"
          className="w-full max-w-md md:max-w-lg h-auto rounded-lg object-cover"
        />
      </div>
    </div>
  );
}

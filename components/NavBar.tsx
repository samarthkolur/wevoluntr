"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push("/Login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row bg-lime-500 p-4 m-4 md:m-10 rounded-lg border-1 border-b-3 border-l-3 border-black text-lime-50 justify-between items-center relative">
      <div className="flex justify-between items-center w-full md:w-auto">
        <h1 className="text-3xl p-2 font-bold">Voluntr</h1>
        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row items-center gap-4 text-grey-100 w-full md:w-auto mt-4 md:mt-0`}
      >
        <Button variant="ghost" className="text-xl w-full md:w-auto">
          NGOs
        </Button>
        <h1 className="text-xl hidden md:block">|</h1>
        <Button variant="ghost" className="text-xl w-full md:w-auto">
          EVENTS
        </Button>
        <div className="flex flex-col md:flex-row items-center gap-4 p-2 w-full md:w-auto">
          <Button onClick={handleLogin} className="w-full md:w-auto">
            Login
          </Button>
          <Button onClick={handleLogin} className="w-full md:w-auto">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

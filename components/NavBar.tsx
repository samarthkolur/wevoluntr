"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getDashboardLink = () => {
    const role = (session?.user as any)?.role;
    return role === "ngo_admin" ? "/dashboard/ngo" : "/dashboard/volunteer";
  };

  return (
    <div className="flex flex-col md:flex-row bg-white p-4 m-4 md:m-10 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] justify-between items-center relative z-50">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link href="/">
          <h1 className="text-3xl p-2 font-black tracking-tighter italic cursor-pointer">
            Voluntr<span className="text-lime-500">.</span>
          </h1>
        </Link>
        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row items-center gap-6 text-black font-bold w-full md:w-auto mt-4 md:mt-0`}
      >
        <Button
          variant="ghost"
          className="text-lg hover:bg-lime-100 hover:text-black transition-colors"
        >
          NGOs
        </Button>
        <Button
          variant="ghost"
          className="text-lg hover:bg-lime-100 hover:text-black transition-colors"
        >
          EVENTS
        </Button>

        <div className="flex flex-col md:flex-row items-center gap-4 p-2 w-full md:w-auto relative">
          {session ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-12 h-12 rounded-full bg-lime-100 border-2 border-black flex items-center justify-center hover:bg-lime-200 transition-colors focus:outline-none"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden flex flex-col z-50">
                  <div className="p-4 border-b-2 border-black bg-lime-50">
                    <p className="font-bold text-sm truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-3 p-3 hover:bg-lime-100 transition-colors font-bold text-sm border-b border-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button className="flex items-center gap-3 p-3 hover:bg-lime-100 transition-colors font-bold text-sm border-b border-gray-100 w-full text-left">
                    <Settings size={18} />
                    Settings
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 transition-colors font-bold text-sm w-full text-left"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="w-full md:w-auto bg-lime-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

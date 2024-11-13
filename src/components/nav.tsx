"use client";

import { useRouter } from "next/navigation";
import { BsDot } from "react-icons/bs";

export function Nav() {
  return (
    <nav className="p-2">
      <ul className="flex items-center justify-start gap-5">
        <NavItem tab="Home" />
        <BsDot className="text-gray-300" />
        <NavItem tab="Asset" />
        <BsDot className="text-gray-300" />
        <NavItem tab="Expense" />
      </ul>
    </nav>
  );
}

function NavItem({ tab }: { tab: string }) {
  const router = useRouter();

  const handleNavigation = (tab: string) => {
    router.push(`/?tab=${tab.toLowerCase()}`);
  };

  return (
    <li className="flex items-center justify-between gap-2 underline">
      <button className="" onClick={() => handleNavigation(tab)}>
        {tab}
      </button>
    </li>
  );
}

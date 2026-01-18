"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BsHouseDoor, BsGraphUpArrow } from "react-icons/bs";

export function Nav() {
  return (
    <nav className="p-2 max-w-2xl mx-auto">
      <ul className="flex items-center justify-start gap-1">
        <NavItem tab="Home" icon={<BsHouseDoor />} />
        <NavItem tab="Asset" icon={<BsGraphUpArrow />} />
      </ul>
    </nav>
  );
}

function NavItem({ tab, icon }: { tab: string; icon: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";
  const isActive = currentTab.toLowerCase() === tab.toLowerCase();

  const handleNavigation = (tab: string) => {
    router.push(`/?tab=${tab.toLowerCase()}`);
  };

  return (
    <li>
      <button
        onClick={() => handleNavigation(tab)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`}
      >
        {icon}
        {tab}
      </button>
    </li>
  );
}

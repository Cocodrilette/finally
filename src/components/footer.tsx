import { IoLogoGithub } from "react-icons/io5";

export function Footer() {
  return (
    <footer className="flex items-center justify-center p-2 mt-5 border-t shadow-sm">
      <a
        href="https://github.com/cocodrilette/finally"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoLogoGithub className="text-2xl" />
      </a>
    </footer>
  );
}

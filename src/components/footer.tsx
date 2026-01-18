import { IoLogoGithub } from "react-icons/io5";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-3 p-4 mt-auto border-t text-muted-foreground">
      <a
        href="https://github.com/cocodrilette/finally"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        <IoLogoGithub className="text-xl" />
      </a>
    </footer>
  );
}

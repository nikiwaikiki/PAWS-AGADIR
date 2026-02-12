import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center font-sans">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
      >
        Return to Home
      </Link>
    </div>
  );
}

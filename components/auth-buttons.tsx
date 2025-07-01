import Link from "next/link";

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Link href="/sign-in" passHref legacyBehavior>
        <a className="inline-flex items-center justify-center rounded-md border border-purple-600 bg-transparent px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Sign In
        </a>
      </Link>
      <Link href="/sign-up" passHref legacyBehavior>
        <a className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Sign Up
        </a>
      </Link>
    </div>
  );
}

import Link from "next/link";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0m737rwcCAi
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-1 flex-col items-center justify-center py-12 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
            Welcome to Kitchensink App
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This is a comprehensive application that provides a variety of
            functionalities. Select one of the following pages to explore more!
          </p>
          <nav className="space-x-4">
            <Link
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              href="/users"
            >
              Users
            </Link>
            <Link
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              href="/posts"
            >
              Posts
            </Link>
            <Link
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              href="/albums"
            >
              Albums
            </Link>
            <Link
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              href="/photos"
            >
              Photos
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}

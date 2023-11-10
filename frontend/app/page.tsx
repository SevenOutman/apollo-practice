import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <ul>
          <li>
            <Link href="/users">Users</Link>
          </li>
          <li>
            <Link href="/albums">Albums</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}

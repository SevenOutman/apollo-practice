/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/K0ZLbMbkjdg
 */
import React from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import Link from "next/link";

export function UserGrid({
  users,
}: {
  users: {
    id: React.Key;
    name?: React.ReactNode;
    username?: React.ReactNode;
    email?: React.ReactNode;
    address?: {
      city?: React.ReactNode;
    } | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {users.map((user) => (
        <Link key={user.id} href={`/users/${user.id}`}>
          <Card className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {user.name}
              </CardTitle>
              <CardDescription className="text-lg text-blue-700 dark:text-blue-300">
                @{user.username}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-blue-600 dark:text-blue-400 mt-2">
              <p>Email: {user.email}</p>
              <p>City: {user.address?.city}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

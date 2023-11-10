"use client";

import { useQuery } from "@apollo/client";
import { UserGrid } from "@/components/user-grid";
import { UserGridSkeleton } from "@/components/user-grid-skeleton";

import { gql } from "../__generated__/gql";

const GET_USERS = gql(/* GraphQL */ `
  query GetUsers {
    users {
      id
      name
      username
      email
      address {
        city
      }
    }
  }
`);
export default function Page() {
  const { data } = useQuery(GET_USERS);

  if (data) {
    return <UserGrid users={data.users} />;
  }

  return <UserGridSkeleton />;
}

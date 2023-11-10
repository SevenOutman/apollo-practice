"use client";

import { useQuery } from "@apollo/client";
import { AlbumList } from "../../components/album-list";

import { gql } from "../__generated__/gql";
import { AlbumListSkeleton } from "@/components/album-list-skeleton";

const GET_ALBUMS = gql(/* GraphQL */ `
  query GetAlbums {
    albums(first: 4) {
      id
      title
      user {
        name
      }
      photos(first: 1) {
        url
      }
    }
  }
`);
export default function Page() {
  const { data } = useQuery(GET_ALBUMS);

  if (data) {
    return <AlbumList albums={data.albums} />;
  }

  return <AlbumListSkeleton />;
}

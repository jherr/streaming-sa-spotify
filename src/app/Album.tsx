"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

import { useAlbumsContext } from "./AlbumProvider";
import type { AlbumInfo } from "./AlbumProvider";

export default function Album({
  url,
  image,
  name,
  artist,
  release_date,
  allowAdd,
}: AlbumInfo & {
  allowAdd?: boolean;
}) {
  const albums = useAlbumsContext();
  const onAdd = () => {
    albums[1]((prev) => [
      ...prev,
      {
        url,
        image,
        name,
        artist,
        release_date,
      },
    ]);
  };

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {artist} - ${release_date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <a href={url}>
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt={`${name} by ${artist} on Spotify`}
          />
        </a>
      </CardContent>
      <CardFooter className="flex justify-end">
        {allowAdd && (
          <Button
            onClick={onAdd}
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            Add To Saved Albums
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

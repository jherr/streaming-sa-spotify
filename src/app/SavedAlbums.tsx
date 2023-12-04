"use client";
import { useAlbumsContext } from "./AlbumProvider";
import Album from "./Album";

export default function SavedCode() {
  const [albums] = useAlbumsContext();
  return (
    <>
      <h2 className="my-2 text-3xl font-bold">Saved Albums</h2>
      <div className="grid grid-cols-2">
        {albums.map((album) => (
          <div key={`${album.artist}-${album.name}`} className="p-1">
            <Album {...album} />
          </div>
        ))}
      </div>
    </>
  );
}

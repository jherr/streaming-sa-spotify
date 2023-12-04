"use client";
import { createContext, useState, useContext } from "react";

export interface AlbumInfo {
  url: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  name: string;
  artist: string;
  release_date: string;
}

const useAlbums = () => useState<AlbumInfo[]>([]);

const AlbumsContext = createContext<ReturnType<typeof useAlbums> | null>(null);

export const useAlbumsContext = () => {
  const context = useContext(AlbumsContext);
  if (context === null) {
    throw new Error("useAlbumsContext must be used within an AlbumsContext");
  }
  return context;
};

export default function AlbumsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const blocks = useAlbums();
  return (
    <AlbumsContext.Provider value={blocks}>{children}</AlbumsContext.Provider>
  );
}

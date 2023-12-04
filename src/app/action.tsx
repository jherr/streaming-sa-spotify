"use server";

import React from "react";
import OpenAI from "openai";
import { OpenAIStream, experimental_StreamingReactResponse, Message } from "ai";
// import Counter from "./Counter";
import { getAlbumInfo } from "./spotify";
import Album from "./Album";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const getAlbums = (aiResponse: string) => {
  const albums = aiResponse.split("\n");
  return albums
    .map((l) => {
      if (l.match(/\(\d+\)$/)) {
        const [album, artist] = l
          .replace(/\(\d+\)$/, "")
          .replace(/-\s+/, "")
          .split(/ - /);
        return {
          artist: artist.trim(),
          album: album.replace(/\"/g, "").trim(),
        };
      }
      return null;
    })
    .filter((v) => v) as { artist: string; album: string }[];
};

export async function handler({ messages }: { messages: Message[] }) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content:
        m.role === "user"
          ? `bullet list in the format "- album - artist (year)" of three music albums from 1970-2000 with beautiful album covers in the theme of "${m.content}"`
          : m.content,
    })),
  });

  const stream = OpenAIStream(response);

  return new experimental_StreamingReactResponse(stream, {
    ui: async (params) => {
      const data = await Promise.all(
        getAlbums(params.content).map(({ artist, album }) =>
          getAlbumInfo(artist, album).then((info) => ({
            url: info?.albums?.items[0]?.external_urls?.spotify,
            image: info?.albums?.items[0]?.images?.[0],
            name: info?.albums?.items[0]?.name,
            release_date: info?.albums?.items[0]?.release_date,
            artist: info?.albums?.items[0]?.artists?.[0]?.name,
          }))
        )
      );
      return (
        <div className="grid grid-cols-2">
          {data
            .filter((album) => album?.image?.url)
            .map((album) => (
              <div key={`${album.artist}-${album.name}`} className="p-1">
                <Album {...album} allowAdd={true} />
              </div>
            ))}
        </div>
      );
    },
  });
}

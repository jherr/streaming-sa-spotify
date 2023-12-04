import { Buffer } from "buffer";
import { Mutex } from "async-mutex";

interface Album {
  href: string;
  items: {
    album_type: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  }[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

interface SpotifyResult {
  albums: Album;
}

let cachedToken: Promise<string> | null = null;

const tokenMutex = new Mutex();

async function getToken() {
  return tokenMutex.runExclusive(async () => {
    if (!cachedToken) {
      console.log("Fetching Spotify token");
      const creds = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
      const encodedCreds = Buffer.from(creds).toString("base64");

      cachedToken = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedCreds}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })
        .then((res) => res.json())
        .then((res) => res.access_token);
    }
    return cachedToken;
  });
}

const albumCache: Record<string, Promise<SpotifyResult>> = {};

const albumMutex = new Mutex();

export async function getAlbumInfo(artist: string, album: string) {
  const token = await getToken();
  return albumMutex.runExclusive(async () => {
    const cacheKey = `${artist}:${album}`;
    if (!albumCache[cacheKey]) {
      console.log("Fetching album info for ", cacheKey);
      albumCache[cacheKey] = fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          `${album} by ${artist}`
        )}&type=album&limit=1&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
    }

    return albumCache[cacheKey];
  });
}

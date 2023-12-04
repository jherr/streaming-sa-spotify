import AlbumsProvider from "./AlbumProvider";
import SavedAlbums from "./SavedAlbums";
import { handler } from "./action";
import { Chat } from "./chat";

export const runtime = "edge";

export default function Page() {
  return (
    <AlbumsProvider>
      <div className="grid grid-cols-2 h-full min-h-full">
        <div className="p-2">
          <Chat handler={handler} />
        </div>
        <div className="border-l-2 border-l-slate-800 p-2 h-full">
          <SavedAlbums />
        </div>
      </div>
    </AlbumsProvider>
  );
}

import { SpeakerIcon } from '../../../../Icons';
import { CardShortProps, CollapsedCard } from './ListCards';
import { AlbumActionsWrapper } from '../../../../Actions/AlbumActions';
import { ArtistActionsWrapper } from '../../../../Actions/ArticleActions';
import { PlayistActionsWrapper } from '../../../../Actions/PlaylistActions';

// Utils
import { useNavigate } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import { yourLibraryActions } from '../../../../../store/slices/yourLibrary';

// Services
import { playerService } from '../../../../../services/player';

// Constants
import { ARTISTS_DEFAULT_IMAGE, PLAYLIST_DEFAULT_IMAGE } from '../../../../../constants/spotify';

// Interface
import type { Album } from '../../../../../interfaces/albums';
import type { Artist } from '../../../../../interfaces/artist';
import type { Playlist } from '../../../../../interfaces/playlists';
import { memo } from 'react';

const CardCompact = (props: CardShortProps) => {
  const { title, subtitle, playing, onClick, onDoubleClick } = props;

  return (
    <button
      onClick={onClick}
      className='library-card'
      style={{ borderRadius: 10 }}
      onDoubleClick={onDoubleClick}
    >
      <div
        style={{
          width: '100%',
          paddingLeft: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 5, width: '100%' }}>
          <h3
            className='text-md font-semibold text-white'
            style={{
              fontSize: 15,
              marginBottom: -5,
              maxWidth: '60%',
              color: playing ? '#1db954' : undefined,
              fontWeight: 100,
            }}
          >
            {title}
          </h3>

          <p
            className='text-md font-semibold text-white'
            style={{
              fontSize: 13,
              opacity: 0.7,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div style={{ padding: 8 }}>
          {playing ? <SpeakerIcon fill='#1db954' height={16} width={16} /> : null}
        </div>
      </div>
    </button>
  );
};

const Card = memo((props: CardShortProps) => {
  const collapsed = useAppSelector((state) => state.ui.libraryCollapsed);

  const onDoubleClick = () => {
    playerService.startPlayback({ context_uri: props.uri });
  };

  if (collapsed) {
    return <CollapsedCard {...props} onDoubleClick={onDoubleClick} />;
  }
  return <CardCompact {...props} onDoubleClick={onDoubleClick} />;
});

const ArtistCardShort = ({ artist }: { artist: Artist }) => {
  const navigate = useNavigate();
  const state = useAppSelector((state) => state.spotify.state);

  const onClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <ArtistActionsWrapper artist={artist} trigger={['contextMenu']}>
      <div>
        <Card
          rounded
          uri={artist.uri}
          onClick={onClick}
          title={artist.name}
          subtitle={`• Artist`}
          playing={state?.context?.uri === artist.uri}
          image={artist?.images[0]?.url || ARTISTS_DEFAULT_IMAGE}
        />
      </div>
    </ArtistActionsWrapper>
  );
};

const AlbumCardShort = ({ album }: { album: Album }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.spotify.state);

  const onClick = () => {
    navigate(`/album/${album.id}`);
  };

  return (
    <AlbumActionsWrapper
      album={album}
      trigger={['contextMenu']}
      onRefresh={() => {
        dispatch(yourLibraryActions.fetchMyAlbums());
      }}
    >
      <div>
        <Card
          uri={album.uri}
          onClick={onClick}
          title={album.name}
          image={album.images[0].url}
          subtitle={`• Album`}
          playing={state?.context?.uri === album.uri}
        />
      </div>
    </AlbumActionsWrapper>
  );
};

const PlaylistCardShort = ({ playlist }: { playlist: Playlist }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const state = useAppSelector((state) => state.spotify.state);

  const onClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <PlayistActionsWrapper
      playlist={playlist}
      trigger={['contextMenu']}
      onRefresh={() => {
        dispatch(yourLibraryActions.fetchMyPlaylists());
      }}
    >
      <div>
        <Card
          onClick={onClick}
          uri={playlist.uri}
          title={playlist.name}
          subtitle={`• Playlist`}
          playing={state?.context?.uri === playlist.uri}
          image={playlist?.images?.length ? playlist?.images[0]?.url : PLAYLIST_DEFAULT_IMAGE}
        />
      </div>
    </PlayistActionsWrapper>
  );
};

export const CompactItemComponent = ({ item }: { item: Artist | Playlist | Album }) => {
  if (item.type === 'artist') return <ArtistCardShort key={item.id} artist={item} />;
  if (item.type === 'album') return <AlbumCardShort key={item.id} album={item} />;
  return <PlaylistCardShort key={item.id} playlist={item} />;
};
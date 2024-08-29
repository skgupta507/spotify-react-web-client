import { FC, memo, useMemo } from 'react';

import { Dropdown, MenuProps } from 'antd';
import { FollowIcon, UnfollowIcon } from '../Icons';

// Utils
import { useTranslation } from 'react-i18next';

// Interface
import type { Artist, SimpleArtist } from '../../interfaces/artist';

// Redux
import { useAppSelector } from '../../store/store';

interface ArtistActionsWrapperProps {
  artist: Artist | Spotify.Track['artists'][0] | SimpleArtist;
  onRefresh?: () => void;
  trigger?: ('contextMenu' | 'click')[];
  children: React.ReactNode | React.ReactNode[];
}

export const ArtistActionsWrapper: FC<ArtistActionsWrapperProps> = memo((props) => {
  const { children, artist } = props;

  const { t } = useTranslation(['playlist']);

  const myArtists = useAppSelector((state) => state.yourLibrary.myArtists);

  const inLibrary = useMemo(() => {
    // @ts-ignore
    const id = artist.id || artist.uri.split(':').reverse()[0];
    return myArtists.some((p) => p.id === id);
  }, [myArtists, artist]);

  const items = useMemo(() => {
    const items: MenuProps['items'] = [];

    if (inLibrary) {
      items.push({
        key: 'remove',
        label: t('Unfollow'),
        icon: <UnfollowIcon />,
        onClick: async () => {},
      });
    } else {
      items.push({
        key: 'add',
        label: t('Follow'),
        icon: <FollowIcon />,
        onClick: async () => {},
      });
    }

    return items;
  }, [inLibrary, t]);

  return (
    <Dropdown menu={{ items }} trigger={props.trigger}>
      {children}
    </Dropdown>
  );
});
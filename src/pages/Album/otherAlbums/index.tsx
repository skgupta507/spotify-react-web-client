import { FC, memo, useMemo } from 'react';
import { GridItemList } from '../../../components/Lists/list';
import { useAppSelector } from '../../../store/store';
import { useTranslation } from 'react-i18next';

export const OtherAlbums: FC = memo(() => {
  const { t } = useTranslation(['album']);

  const artist = useAppSelector((state) => state.album.artist);
  const current = useAppSelector((state) => state.album.album);
  const otherAlbums = useAppSelector((state) => state.album.otherAlbums);

  const items = useMemo(() => {
    if (current) {
      return otherAlbums.filter((album) => album.id !== current.id);
    }
    return otherAlbums;
  }, [current, otherAlbums]);

  return <GridItemList title={`${t('More by')} ${artist?.name}`} items={items} />;
});

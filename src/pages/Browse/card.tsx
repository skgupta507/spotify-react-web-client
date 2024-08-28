/* eslint-disable jsx-a11y/alt-text */
import { FC, memo, useEffect, useState } from 'react';
import { Category } from '../../interfaces/categories';
import { getImageAnalysis } from '../../utils/imageAnyliser';
import { Link } from 'react-router-dom';

export const BrowseCard: FC<{ category: Category }> = memo(({ category }) => {
  const [color, setColor] = useState('rgb(220, 20, 60)');

  useEffect(() => {
    if (category.icons.length) {
      const { url } = category.icons[0];
      getImageAnalysis(url).then((color) => {
        setColor(color);
      });
    }
  }, [category.icons]);

  return (
    <div>
      <Link to={`/genre/${category.id}`} className='browse-card'>
        <div className='browse-card-container' style={{ backgroundColor: color }}>
          <img loading='lazy' src={category.icons[0].url} />
          <span>{category.name}</span>
        </div>
      </Link>
    </div>
  );
});

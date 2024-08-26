import { Space } from 'antd';
import { Link } from 'react-router-dom';

// Utils
import { useTranslation } from 'react-i18next';

// Redux
import { useAppSelector } from '../../../../store/store';

const Header = ({ opacity }: { opacity: number; title?: string }) => {
  const { t } = useTranslation(['navbar']);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div
      className={`flex r-0 w-full flex-row items-center justify-between bg-gray-900 rounded-t-md z-10`}
      style={{ backgroundColor: `rgba(12, 12, 12, ${opacity}%)` }}
    >
      <div className='flex flex-row items-center'>
        <Space>
          <a
            target='_blank'
            rel='noreferrer'
            className='contact-me'
            href='https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=francoborrelli96@gmail.com&su=SUBJECT'
          >
            <span>{t('Contact me')}</span>
          </a>

          {/*
          <div className='news'>
            <News />
          </div> */}

          <div className='avatar-container'>
            <Link to='/profile'>
              <img
                className='avatar'
                id='user-avatar'
                alt='User Avatar'
                style={{ marginTop: -1 }}
                src={user?.images[0].url}
              />
            </Link>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Header;
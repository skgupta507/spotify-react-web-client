import './styles/App.scss';

// Utils
import i18next from 'i18next';
import { Suspense, lazy, useEffect, useRef } from 'react';

// Components
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/Layout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { libraryActions } from './store/slices/library';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store, useAppDispatch, useAppSelector } from './store/store';
import { SearchPage } from './pages/Search';
import WebPlayback, { WebPlaybackProps } from './utils/spotify/webPlayback';
import { authActions, loginToSpotify } from './store/slices/auth';
import { Spinner } from './components/spinner/spinner';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Page404 = lazy(() => import('./pages/404'));
const Profile = lazy(() => import('./pages/Profile'));
const PlaylistView = lazy(() => import('./pages/Playlist'));

window.addEventListener('resize', () => {
  const vh = window.innerWidth;
  if (vh < 950) {
    store.dispatch(libraryActions.collapseLibrary());
  }
});

const RootComponent = () => {
  const dispatch = useAppDispatch();
  const container = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const language = useAppSelector((state) => state.language.language);

  useEffect(() => {
    dispatch(loginToSpotify());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    i18next.changeLanguage(language);
  }, [language]);

  const routes = [
    { path: '', element: <Home container={container} /> },
    { path: '/profile', element: <Profile /> },
    { path: '/search/:search', element: <SearchPage /> },
    { path: '/playlist/:playlistId', element: <PlaylistView container={container} /> },
    { path: '*', element: <Page404 /> },
  ] as const;

  const webPlaybackSdkProps: WebPlaybackProps = {
    playerAutoConnect: true,
    playerInitialVolume: 1.0,
    playerRefreshRateMs: 1000,
    playerName: 'Spotify React Player',
    onPlayerRequestAccessToken: () => Promise.resolve(token!),
    onPlayerLoading: () => {},
    onPlayerWaitingForDevice: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
      dispatch(authActions.fetchUser());
    },
    onPlayerError: (e) => {
      console.log(e);
      localStorage.removeItem('spo-token');
      dispatch(loginToSpotify());
    },
    onPlayerDeviceSelected: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
    },
  };

  return (
    <WebPlayback {...webPlaybackSdkProps}>
      <Spinner loading={!user}>
        <Router>
          <AppLayout>
            <div className='Main-section' ref={container}>
              <div style={{ minHeight: 'calc(100vh - 230px)', width: '100%' }}>
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<Suspense>{route.element}</Suspense>}
                    />
                  ))}
                </Routes>
              </div>
            </div>
          </AppLayout>
        </Router>
      </Spinner>
    </WebPlayback>
  );
};

function App() {
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'SpotifyMixUI' } }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootComponent />
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
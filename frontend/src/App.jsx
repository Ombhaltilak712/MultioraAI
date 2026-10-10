import { useEffect, useState } from 'react';
import Home from './pages/Home';
import PublicSharedChat from './pages/PublicSharedChat';
import FullScreenLoader from './components/FullScreenLoader';
import getCurrentUser from './features/getCurrentUser';
import { useDispatch } from 'react-redux';
import { setUserdata } from './redux/userSlice';

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const [shareToken, setShareToken] = useState(() => {
    const match = window.location.pathname.match(/^\/share\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUserdata(data));
      } catch {
        // User not logged in
      } finally {
        setAuthChecked(true);
      }
    };
    getUser();
  }, [dispatch]);

  // Listen for history popstate
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/share\/([a-zA-Z0-9_-]+)/);
      setShareToken(match ? match[1] : null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (shareToken) {
    return (
      <PublicSharedChat
        token={shareToken}
        onGoHome={() => {
          window.history.pushState({}, '', '/');
          setShareToken(null);
        }}
      />
    );
  }

  if (!authChecked) {
    return <FullScreenLoader />;
  }

  return <Home />;
}

export default App;

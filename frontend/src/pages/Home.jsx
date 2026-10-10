import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { auth, googleProvider } from '../../utils/firebase';
import api from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
import LibraryView from '../components/LibraryView';
import Landing from './Landing';

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'library'
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post('/api/auth/login', { token });
      dispatch(setUserdata(data));
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.response?.data?.message || 'Failed to log in to server');
    }
  };

  const googleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setLoginError(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  if (!userData) {
    return (
      <Landing
        onGetStarted={googleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
      />
    );
  }

  return (
    <div className="h-screen flex bg-[#05060a] text-white overflow-hidden relative font-['Inter']">
      {/* Background Aurora Glows & Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[400px] bg-indigo-500/[0.07] rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-violet-600/[0.05] rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 left-1/4 w-[400px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 flex h-full w-full overflow-hidden">
        <SideBar activeView={currentView} onSelectView={setCurrentView} />

        {currentView === 'library' ? (
          <LibraryView onBackToChat={() => setCurrentView('chat')} />
        ) : (
          <>
            <ChatArea />
            <Artifact />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

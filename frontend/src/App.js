// eslint-disable-next-line
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
// eslint-disable-next-line
import useSession from './hooks/useSession'; 

function App() {
  const location = useLocation();
  const renderNavbar = location.pathname !== '/';

  // const userId = getUserId();
  // useSession(userId);

  // function getUserId() {
  //   const userId = sessionStorage.getItem('userId');
  //   if (!userId) {
  //     throw new Error('User ID not found in session');
  //   }
  //   return userId;
  // }

  // if (!userId) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="App">
      {renderNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

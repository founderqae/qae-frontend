import { Outlet } from 'react-router-dom';
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
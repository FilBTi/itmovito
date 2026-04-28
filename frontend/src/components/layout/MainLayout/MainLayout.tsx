import { Outlet } from 'react-router';

import Header from '../Header';

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;

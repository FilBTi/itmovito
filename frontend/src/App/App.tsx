import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router';

import AppQueryClientProvider from '@/components/providers/AppQueryClientProvider';

import router from './router';

const App: React.FC = () => {
  return (
    <AppQueryClientProvider>
      {/* Сброс стилей */}
      <CssBaseline />
      <RouterProvider router={router} />
    </AppQueryClientProvider>
  );
};

export default App;

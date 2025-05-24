import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '../contexts/UserContext';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="light"
      />  
    </UserProvider>
  );
}

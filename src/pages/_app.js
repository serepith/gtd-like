import { FirebaseProvider } from '../contexts/FirebaseContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
}

export default MyApp;
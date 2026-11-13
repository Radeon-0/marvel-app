import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './components/app/App'
import "./style/style.scss";



createRoot(document.getElementById('root')).render(
  <StrictMode>
      <HelmetProvider>
          <App />
      </HelmetProvider>
  </StrictMode>
)

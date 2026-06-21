import { getBasePath } from 'backroad-components';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { ThemeProvider } from './app/theme/theme-provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ThemeProvider>
      {/* basename is the mount sub-path so all in-app routing is prefixed. */}
      <BrowserRouter basename={getBasePath() || undefined}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

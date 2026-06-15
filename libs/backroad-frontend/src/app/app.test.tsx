import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import App from './app';
import { ThemeProvider } from './theme/theme-provider';

describe('App', () => {
  it('should render successfully', () => {
    // App consumes useTheme via the navbar, so it must render inside a
    // ThemeProvider (mirrors the wrapping in main.tsx).
    const { baseElement } = render(
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});

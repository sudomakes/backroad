import type { CSSProperties } from 'react';
import type { GlobalProvider } from '@ladle/react';
import { MemoryRouter } from 'react-router-dom';
import '../apps/client/src/styles.scss';

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '24px',
  background: '#f3f4f6',
  color: '#111827',
  boxSizing: 'border-box',
};

const canvasStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '24px',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
};

export const Provider: GlobalProvider = ({ children }) => (
  <MemoryRouter>
    <div style={pageStyle}>
      <div style={canvasStyle}>{children}</div>
    </div>
  </MemoryRouter>
);

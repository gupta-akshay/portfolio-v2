import { config } from '@fortawesome/fontawesome-svg-core';
import { rubik } from './fonts';
import { LoadingProvider } from './context/LoadingContext';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'devicon/devicon.min.css';
import './styles/globals.scss';

config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body className={`${rubik.variable}`}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}

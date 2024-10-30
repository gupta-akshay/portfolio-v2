import { Html, Head, Main, NextScript } from 'next/document';
import { type DocumentProps } from 'next/document';
import crypto from 'crypto';

function getServerNonce(props: DocumentProps) {
  // For SSR, generate a new nonce
  if (props.__NEXT_DATA__) {
    return crypto.randomBytes(16).toString('base64');
  }
  // For client-side, get nonce from response header
  if (typeof window !== 'undefined') {
    return (
      document.head
        .querySelector('meta[name="csp-nonce"]')
        ?.getAttribute('content') ?? ''
    );
  }
  return '';
}

export default function Document(props: DocumentProps) {
  const nonce = getServerNonce(props);

  return (
    <Html>
      <Head>
        <meta name='csp-nonce' content={nonce} />
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}

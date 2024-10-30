import Script from 'next/script';
import { headers } from 'next/headers';

export default async function CustomScript() {
  const nonce = (await headers()).get('x-nonce');

  return (
    <>
      <Script
        nonce={nonce ?? undefined}
        id='my-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `console.log('Akshay');`,
        }}
      />
    </>
  );
}

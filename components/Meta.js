import Head from 'next/head'

const Meta = () => (
  <Head>
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="msapplication-starturl" content="/" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="description" content="notes" />
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="/icon.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/icon.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/icon.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>notes</title>
  </Head>
)

export default Meta

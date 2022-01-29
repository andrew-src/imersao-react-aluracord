import appConfig from '../config.json';
import Head from 'next/head';

function GlobalStyle() {
  return (
      <style global jsx>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      list-style: none;
    }
    body {
      font-family: 'Open Sans', sans-serif;
    }
    /* App fit Height */ 
    html, body, #__next {
      min-height: 100vh;
      display: flex;
      flex: 1;
    }
    #__next {
      flex: 1;
    }
    #__next > * {
      flex: 1;
    }
    /* ./App fit Height */ 
  `}</style>
  );
}

export default function CustomApp({ Component, pageProps }) {
  console.log('Está vivo!');
  return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="https://starwarsblog.starwars.com/wp-content/uploads/2020/01/Emoji-Blitz-Star-Wars-the-Mandalorian-single.png" />
          <title>Mandocord</title>
        </Head>
        <GlobalStyle />
        <Component {...pageProps} />
      </>
  );
}

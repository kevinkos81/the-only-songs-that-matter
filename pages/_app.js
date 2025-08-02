import '../styles/globals.css';
import { MDXProvider } from '@mdx-js/react';

const components = {
  // You can customize MDX components here
  // e.g. video: (props) => <video {...props} controls />
};

function MyApp({ Component, pageProps }) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

export default MyApp;

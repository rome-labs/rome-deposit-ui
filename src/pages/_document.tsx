import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bucket-scrollbar dark">
      <Head>
        <meta
          name="Rome Deposit UI"
          content="Rome deposit/withdraw UI with localnet."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

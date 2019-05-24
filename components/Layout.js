import Link from "next/link";
import Head from "next/head";

export default class Layout extends React.Component {
  render() {
    const { children, title } = this.props;

    return (
      <div>
        <Head>
          <title>{title}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="stylesheet" href="static/styles.css" />
          <link
            href="https://fonts.googleapis.com/css?family=Press Start 2P"
            rel="stylesheet"
          />
          <script src="static/talkify.js" />
        </Head>

        <div className="container">
          <header>
            <div className="led-blue" />
            <div className="three-leds">
              <div className="led-red" />
              <div className="led-yellow" />
              <div className="led-green" />
            </div>
          </header>

          {children}
        </div>

        <style jsx global>{`
          body,
          html {
            margin: 0;
            font-family: "Press Start 2P", system-ui;
            font-size: 10px;
            background: transparent;
          }
        `}</style>
      </div>
    );
  }
}

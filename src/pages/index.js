import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Head from "@docusaurus/Head";

function VIALogo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 525.74 268.41"
      {...props}
    >
      <defs>
        <style>{'.cls-1{fill:currentColor}'}</style>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_2-2" data-name="Layer 2">
          <path
            className="cls-1"
            d="M524.6 237.33 459.25 37.88C451.73 14.93 432.81.12 411 .12h-.13c-21.87.06-40.79 15-48.21 38.11l-64 199.23a22.93 22.93 0 0 0 43.66 14l18.74-58.35h100.81l19.13 58.5a22.93 22.93 0 0 0 43.58-14.28Zm-145-90a2.78 2.78 0 0 1-2.65-3.63l29.37-91.41C407.82 47.68 410 46 411 46c1 0 3.17 1.68 4.65 6.19l30 91.49a2.78 2.78 0 0 1-2.64 3.64ZM212.25 1.21A22.93 22.93 0 0 0 183.41 16l-64 199.23c-1.47 4.57-3.66 6.28-4.69 6.29-1 0-3.17-1.68-4.64-6.19L44.72 15.91A22.92 22.92 0 1 0 1.15 30.18l65.34 199.45c7.52 23 26.44 37.77 48.22 37.77h.14c21.86-.06 40.78-15 48.2-38.11l64-199.23a22.93 22.93 0 0 0-14.8-28.85ZM306.09 1.1a22.93 22.93 0 0 0-28.84 14.82l-71.5 222.54a22.93 22.93 0 1 0 43.66 14l71.5-222.55A22.93 22.93 0 0 0 306.09 1.1Zm-78.17 255.45a12.5 12.5 0 1 1 12.5-12.5 12.5 12.5 0 0 1-12.5 12.5Zm70.7-220.91a12.5 12.5 0 1 1 12.5-12.5 12.5 12.5 0 0 1-12.5 12.5Z"
          />
        </g>
      </g>
    </svg>
  );
}

const features = [
  {
    title: <>Simple</>,
    imageUrl: "img/undraw_walking_around.svg",
    description: <>Plug in your keyboard. It's that easy.</>,
    callToAction: "Start Now",
    callToActionUrl: "https://www.usevia.app",
  },
  {
    title: <>Friendly</>,
    imageUrl: "img/undraw_different_love.svg",
    description: (
      <>
        Compatible with 1400+ keyboards and easily added to other QMK keyboards.
      </>
    ),
    callToAction: "Check compatibility",
    callToActionUrl: "/docs/supported_keyboards",
  },
  {
    title: <>Helpful</>,
    imageUrl: "img/undraw_game_world.svg",
    description: (
      <>
        Configure, test and design in one place - VIA is the last application
        you'll need for your keyboard.
      </>
    ),
    callToAction: "Read the docs",
    callToActionUrl: "/docs/specification",
  },
];

function Feature({
  imageUrl,
  title,
  description,
  callToAction,
  callToActionUrl,
}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      <div className={styles.featureButton}>
        <Link
          className={classnames(
            "button button--outline button--secondary button--lg",
            styles.getStarted
          )}
          to={callToActionUrl}
        >
          {callToAction}
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const seoURL = "https://caniusevia.com/img/icon.png";
  return (
    <>
      <Head>
        <meta property="og:image" content={seoURL} />
        <meta property="twitter:image" content={seoURL} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Layout
        title={`${siteConfig.title}`}
        description="Your keyboard's best friend"
      >
        <header className={classnames("hero hero--primary", styles.heroBanner)}>
          <div className="container">
            <VIALogo style={{ padding: 20 }} color={"rgba(242,242,242,1)"} />
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
        </header>
        <main>
          {features && features.length && (
            <section className={styles.features}>
              <div className="container">
                <div className="row">
                  {features.map((props, idx) => (
                    <Feature key={idx} {...props} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </Layout>
    </>
  );
}

export default Home;

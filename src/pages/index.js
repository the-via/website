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
      id="prefix__Layer_1"
      x={0}
      y={0}
      viewBox="0 0 53.6 33.9"
      xmlSpace="preserve"
      {...props}
    >
      <style>
        {`.prefix__st0{enable-background:new}.prefix__st1{fill:${props.color};}`}
        {"#prefix__Layer_1{width:250px;}"}
      </style>
      <title>{"Asset 2"}</title>
      <g className="prefix__st0">
        <path
          className="prefix__st1"
          d="M5.7 4.1l5.8 17.3L17.4 4c.3-.9.5-1.5.7-1.9s.4-.7.8-1 .8-.4 1.4-.4c.4 0 .9.1 1.2.3s.7.5.9.9.4.7.4 1.1c0 .3 0 .5-.1.8l-.3.9-.3.9-6.2 16.8c-.2.6-.4 1.3-.7 1.8s-.5 1.1-.8 1.5-.7.8-1.2 1.1-1.1.4-1.8.4-1.3-.1-1.8-.4-.9-.6-1.2-1.1-.6-1-.8-1.5-.4-1.2-.7-1.8L.9 5.7l-.3-.9-.3-.9C.2 3.6.2 3.2.2 3c0-.6.2-1.1.7-1.6S2 .7 2.7.7c.9 0 1.5.3 1.9.8s.8 1.4 1.1 2.6z"
        />
      </g>
      <g className="prefix__st0">
        <path
          className="prefix__st1"
          d="M47.8 23.9l-1.2-3.2H36.1L34.8 24c-.5 1.3-.9 2.2-1.2 2.6s-.9.7-1.7.7c-.7 0-1.2-.2-1.7-.7s-.8-1-.8-1.6c0-.4.1-.7.2-1.1s.3-.9.6-1.6l6.6-16.8c.2-.5.4-1.1.7-1.7s.5-1.2.8-1.7.7-.8 1.2-1.1 1.1-.4 1.8-.4 1.3.1 1.8.4.9.6 1.2 1.1.6.9.8 1.4.5 1.2.8 2l6.6 16.6c.5 1.3.8 2.2.8 2.8 0 .6-.2 1.1-.7 1.6s-1.1.7-1.8.7c-.4 0-.8-.1-1.1-.2s-.5-.3-.7-.6-.4-.6-.6-1.2-.5-.9-.6-1.3zm-10.4-7.1h7.7L41.2 6.1l-3.8 10.7z"
        />
      </g>
      <circle className="prefix__st1" cx={12} cy={31.7} r={1.9} />
      <circle className="prefix__st1" cx={41.2} cy={31.7} r={1.9} />
      <path
        d="M21.3 27.2l-.4-.2c-1.1-.4-1.6-1.6-1.2-2.7l8.7-22.6C28.8.6 30 .1 31.1.5l.4.2c1.1.4 1.6 1.6 1.2 2.7L24 26c-.5 1-1.7 1.6-2.7 1.2z"
        className="prefix__st1"
      />
      <path
        className="prefix__st1"
        d="M34.4 33.1H18.8c-.6 0-1-.4-1-1v-.7c0-.6.4-1 1-1h15.6c.6 0 1 .4 1 1v.7c0 .5-.4 1-1 1z"
      />
    </svg>
  );
}

const features = [
  {
    title: <>Simple</>,
    imageUrl: "img/undraw_walking_around.svg",
    description: <>Download, install, plug in your keyboard. It's that easy.</>,
    callToAction: "Download VIA",
    callToActionUrl: "https://www.github.com/the-via/releases/releases/latest",
  },
  {
    title: <>Friendly</>,
    imageUrl: "img/undraw_different_love.svg",
    description: (
      <>
        Compatible with over 500 keyboards and easily added to other QMK
        keyboards.
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
  console.log(callToAction, callToActionUrl);
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

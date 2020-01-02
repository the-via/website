import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Head from "@docusaurus/Head";

const features = [
  {
    title: <>Simple</>,
    imageUrl: "img/undraw_walking_around.svg",
    description: <>Download, install, plug in your keyboard. It's that easy.</>,
    callToAction: "Download VIA",
    callToActionUrl: "https://www.github.com/the-via/releases/releases/latest"
  },
  {
    title: <>Friendly</>,
    imageUrl: "img/undraw_different_love.svg",
    description: (
      <>
        Compatible with over over 40 keyboards and easily added to other QMK
        keyboards.
      </>
    ),
    callToAction: "Check compatibility",
    callToActionUrl: "/docs/supported_keyboards"
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
    callToActionUrl: "/docs/specification"
  }
];

function Feature({
  imageUrl,
  title,
  description,
  callToAction,
  callToActionUrl
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
            <h1 className="hero__title">
              V<span>I</span>A
            </h1>
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

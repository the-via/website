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
    description: (
      <>Download, install, plug in your keyboard, and you're already done. </>
    )
  },
  {
    title: <>Comprehensive</>,
    description: (
      <>
        You can configure your keyboard, test it after building, and design your
        future pcb all in the same application. VIA is the last application
        you'll need for your keyboard.
      </>
    )
  },
  {
    title: <>Compatiblility</>,
    description: (
      <>
        With over over 40 keyboards compatible today, VIA compatibility can be
        easily added to any QMK keyboard.{" "}
      </>
    )
  }
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
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
        description="Customization made trivial"
      >
        <header className={classnames("hero hero--primary", styles.heroBanner)}>
          <div className="container">
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className={classnames(
                  "button button--outline button--secondary button--lg",
                  styles.getStarted
                )}
                to={"https://www.github.com/the-via/releases/releases/latest"}
              >
                Download
              </Link>
            </div>
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

module.exports = {
  title: "VIA",
  tagline: "Your keyboard's best friend",
  url: "https://caniusevia.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "the-via", // Usually your GitHub org/user name.
  projectName: "keyboards", // Usually your repo name.
  themeConfig: {
    twitterImage: "img/icon.png",
    ogImage: "img/icon.png",
    navbar: {
      title: "VIA",
      logo: {
        alt: "VIA",
        src: "img/icon.png"
      },
      links: [
        {
          href: "https://github.com/the-via/releases/releases/latest",
          label: "Download",
          position: "left"
        },
        {
          to: "docs/supported_keyboards",
          label: "Supported Keyboards",
          position: "left"
        },
        { to: "docs/specification", label: "Docs", position: "left" }
      ]
    },
    footer: {
      style: "dark",
      links: [],
      copyright: "Built with <2 from the VIA team."
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js")
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};

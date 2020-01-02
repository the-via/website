module.exports = {
  title: "VIA",
  tagline: "Customization made trivial",
  url: "https://caniusevia.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "the-via", // Usually your GitHub org/user name.
  projectName: "keyboards", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "VIA",
      logo: {
        alt: "VIA",
        src: "img/icon.png"
      },
      links: [
        { to: "docs/specification", label: "Documentation", position: "left" }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Specification",
              to: "docs/specification"
            }
          ]
        }
      ],
      copyright: `Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};

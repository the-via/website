module.exports = {
  title: "VIA",
  tagline: "Your keyboard's best friend",
  url: "https://caniusevia.com",
  baseUrl: "/",
  organizationName: "the-via", // Usually your GitHub org/user name.
  projectName: "keyboards", // Usually your repo name.
  themeConfig: {
    twitterImage: "img/icon.png",
    ogImage: "img/icon.png",
    navbar: {
      title: "VIA",
      logo: {
        alt: "VIA",
        src: "img/icon.png",
      },
      items: [
        {
          href: "https://www.usevia.app",
          label: "Try Now!",
          position: "left",
        },
        { to: "docs/whats_new", label: "What's New", position: "left" },
        {
          to: "docs/supported_keyboards",
          label: "Supported Keyboards",
          position: "left",
        },
        { to: "docs/specification", label: "Docs", position: "left" },
        { to: "docs/download_firmware", label: "Firmware", position: "left" },
        {
          href: "https://discord.gg/NStTR5YaPB",
          label: "Discord",
          position: "right",
        },
        {
          href: "https://github.com/the-via",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: "Built with &lt;2 from the VIA team.",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};

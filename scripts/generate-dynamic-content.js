const fetch = require("node-fetch");
const fs = require("fs");
const Handlebars = require("handlebars");

const transformFirmware = (fw) =>
  fw.tree.filter(({ path }) => /\.(bin|hex)/.test(path));

const transformKeyboards = (kbs) =>
  Object.values(kbs.definitions)
    .map(({ name }) => name)
    .sort((a, b) =>
      a.localeCompare(b, "en", undefined, { sensitivity: "base" })
    );

const generateContent = async (url, transform, fileName) => {
  const content = await (await fetch(url)).json();
  const templatedContent = Handlebars.compile(
    fs.readFileSync(`templates/${fileName}.hbs`, "utf-8")
  )({ date: new Date().toLocaleDateString(), content: transform(content) });
  fs.writeFileSync(`docs/${fileName}.mdx`, templatedContent);
};

[
  [
    "https://api.github.com/repos/the-via/firmware/git/trees/master",
    transformFirmware,
    "download_firmware",
  ],
  [
    "https://www.caniusevia.com/keyboards.v2.json",
    transformKeyboards,
    "supported_keyboards",
  ],
].forEach((args) => generateContent(...args));

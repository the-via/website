import React from "react";
import { commonMenus } from "@the-via/reader";
import CodeBlock from "@theme/CodeBlock";
import stringify from "json-stringify-pretty-compact";
import Heading from "@theme/Heading";

export const RenderCommonMenus = () =>
  Object.entries(commonMenus).map(([key, value]) => {
    return (
      <div key={key}>
        <Heading as="h2" id={key} accessKey={key}>
          {key}
        </Heading>
        <CodeBlock language="json" showLineNumbers={true}>
          {stringify(value)}
        </CodeBlock>
      </div>
    );
  });

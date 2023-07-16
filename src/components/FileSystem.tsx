interface Mock {
  name: string;
  type: string;
  subItems?: Mock[];
  isCollapsed?: boolean;
  isNested?: boolean;
}
export const mock: Mock[] = [
  {
    name: "public",
    type: "folder",

    subItems: [
      {
        name: "css",
        type: "folder",
        isNested: true,
        subItems: [
          {
            name: "scss",
            type: "folder",
            isNested: true,
            subItems: [
              {
                name: "index.scss",
                type: "files",
              },
            ],
          },
        ],
      },
      {
        name: "index.html",
        type: "files",
        isCollapsed: false,
      },
    ],
  },
  {
    name: "src",
    type: "folder",
    isCollapsed: false,
    subItems: [
      {
        name: "app.js",
        type: "files",
      },
      {
        name: "FileSystem.js",
        type: "files",
      },
      {
        name: "index.js",
        type: "files",
      },
      {
        name: "styles.css",
        type: "files",
      },
    ],
  },
];

import { useState } from "react";

export default function FileSystem({ data }: { data: Mock }) {
  const [expand, setExpand] = useState(false);
  return (
    <div>
      <div>
        <h3 onClick={() => setExpand(!expand)}>
          <span>{data.type === "folder" ? "📁" : "📄"}</span> {data.name}
        </h3>
      </div>

      <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {data?.subItems && data.subItems.length > 0 ? (
          data?.subItems?.map((subitem, index) => {
            if (subitem.type === "files") {
              return (
                <h3 key={index}>
                  {/* @ts-expect-error */}
                  <span>{subitem.type === "folder" ? "📁" : "📄"}</span>{" "}
                  {subitem.name}
                </h3>
              );
            }
            return <FileSystem key={index} data={subitem} />;
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

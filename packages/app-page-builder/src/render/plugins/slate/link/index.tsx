import React from "react";
import { PbRenderSlateEditorPlugin } from "@webiny/app-page-builder/types";

export default (): PbRenderSlateEditorPlugin => {
    return {
        name: "pb-render-slate-editor-link",
        type: "pb-render-slate-editor",
        slate: {
            renderNode(props, next) {
                const { attributes, children, node } = props;

                // @ts-ignore
                if (node.type === "link") {
                    // @ts-ignore
                    const { data } = node;
                    const href = data.get("href");
                    const noFollow = data.get("noFollow");
                    const newTab = data.get("newTab");

                    return (
                        <a
                            {...attributes}
                            {...{ href, rel: noFollow ? "nofollow" : null }}
                            target={newTab ? "_blank" : "_self"}
                        >
                            {children}
                        </a>
                    );
                }

                return next();
            }
        }
    };
};
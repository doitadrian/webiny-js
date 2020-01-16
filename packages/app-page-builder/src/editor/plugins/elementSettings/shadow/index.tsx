import React from "react";
import { ReactComponent as ShadowIcon } from "@webiny/app-page-builder/editor/assets/icons/layers.svg";
import Settings from "./Settings";
import Action from "../components/Action";
import { PbPageElementSettingsPlugin } from "@webiny/app-page-builder/admin/types";

export default {
    name: "pb-page-element-settings-shadow",
    type: "pb-page-element-settings",
    renderAction() {
        return <Action tooltip={"Shadow"} plugin={this.name} icon={<ShadowIcon />} />;
    },
    renderMenu() {
        return <Settings />;
    }
} as PbPageElementSettingsPlugin;
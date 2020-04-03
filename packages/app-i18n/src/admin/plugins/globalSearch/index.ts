import { GlobalSearchPlugin } from "@webiny/app-admin/types";

// Additional sections in global search.
export default {
    type: "global-search",
    name: "global-search-i18n-texts",
    route: "/i18n/texts",
    label: "I18N Texts",
    search: {
        fields: ["namespace", "text"]
    }
} as GlobalSearchPlugin;

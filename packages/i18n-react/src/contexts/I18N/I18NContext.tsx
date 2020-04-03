import React from "react";
import { i18n } from "@webiny/i18n";
import reactProcessor from "@webiny/i18n-react";

i18n.registerProcessor(reactProcessor).setDefaultProcessor("react");

const I18NContext = React.createContext(null);
const defaultState = {
    i18n: null,
    loading: false
};

const I18NProvider = ({ children, translations, loading }) => {
    console.log('im setting this too late', translations)
    i18n.setTranslations(translations);

    const value = {
        ...defaultState,
        i18n,
        loading
    };

    return <I18NContext.Provider value={value}>{children}</I18NContext.Provider>;
};

export { I18NProvider, I18NContext };

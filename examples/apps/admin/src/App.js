import { hot } from "react-hot-loader";
import React from "react";
import { UiProvider } from "@webiny/app/contexts/Ui";
import { registerPlugins, getPlugins } from "@webiny/plugins";
import { ThemeProvider } from "@webiny/app-admin/contexts/Theme";
import { AppInstaller } from "@webiny/app-admin/components/Install/AppInstaller";
import { PageBuilderProvider } from "@webiny/app-page-builder/contexts/PageBuilder";
import { SecurityProvider } from "@webiny/app-security/contexts/Security";
import { I18NProvider } from "@webiny/app-i18n/contexts/I18N";
import { I18NProvider as I18NReactProvider } from "@webiny/i18n-react/contexts/I18N"; // TODO @i18n: think of better naming
import { CircularProgress } from "@webiny/ui/Progress";
import { i18n } from "@webiny/i18n";

import plugins from "./plugins";
import "./App.scss";

const t = i18n.ns("apps/admin");
registerPlugins(plugins);

// Execute `init` plugins, they may register more plugins dynamically
getPlugins("webiny-init").forEach(plugin => plugin.init());

const securityProvider = (
    <SecurityProvider loader={<CircularProgress label={t`Checking user...`} />} />
);

const App = () => {
    // TODO @i18n: Think about the order of providers and props, then finish.
    return (
        <UiProvider>
            {/* Gets current locale and sends it to the "@webiny/i18n-react" provider */}
            <I18NProvider loader={<CircularProgress label={t`Loading locales...`} />}>
                {/* Send current locale and translations. */}
                <I18NReactProvider>
                    <AppInstaller security={securityProvider}>
                        <PageBuilderProvider>
                            <ThemeProvider>
                                {getPlugins("route").map(pl =>
                                    React.cloneElement(pl.route, {
                                        key: pl.name,
                                        exact: true
                                    })
                                )}
                            </ThemeProvider>
                        </PageBuilderProvider>
                    </AppInstaller>
                </I18NReactProvider>
            </I18NProvider>
        </UiProvider>
    );
};

export default hot(module)(App);

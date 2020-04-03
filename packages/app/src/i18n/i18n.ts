import { I18N, stringProcessor, defaultModifiers } from "@webiny/i18n";
import reactProcessor from "@webiny/i18n-react";

const i18n = new I18N();
i18n.registerProcessors([reactProcessor, stringProcessor]);
i18n.registerModifiers(defaultModifiers({ i18n }));

export default i18n;

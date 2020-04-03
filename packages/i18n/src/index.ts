import I18N from "./I18N";
import stringProcessor from "./processors/string";
import defaultModifiers from "./modifiers";
import isValidNamespace from "./isValidNamespace";

const i18n = new I18N();
i18n.registerProcessors([stringProcessor]).registerModifiers(defaultModifiers({ i18n }));

export { i18n, I18N, defaultModifiers, stringProcessor, isValidNamespace };

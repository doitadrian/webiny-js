import { flow, get } from "lodash";
import { withFields, string, withName, onSet } from "@webiny/commodo";
import { i18nString } from "@webiny/api-i18n/fields";
import isValidNamespace from "@webiny/i18n/isValidNamespace";
import { validation } from "@webiny/validation";

const namespaceValidation = value => {
    validation.validateSync(value, "required");
    if (!isValidNamespace(value)) {
        throw new Error(
            `Not a valid I18N namespace, can only accept lowercase letters, numbers, forward slashes ("/"), and dashes ("-").`
        );
    }
};

export default ({ createBase, context, I18NStats }) => {
    const I18NText: any = flow(
        withName("I18NText"),
        withFields(instance => ({
            namespace: string({ validation: namespaceValidation }),
            text: string({ validation: validation.create("required") }),
            translations: onSet(value => {
                const oldValue = instance.translations || {};
                if (!oldValue.values) {
                    oldValue.values = [];
                }

                const newValue = value || {};
                if (!newValue.values) {
                    newValue.values = [];
                }

                // Let's detect changes - if new translations were added or existing were removed.
                const changes = {
                    add: [],
                    remove: []
                };

                // Check old values - see if a translation for locale has been removed.
                for (let i = 0; i < oldValue.values.length; i++) {
                    const current = oldValue.values[i];
                    const newValueValue = newValue.values.find(
                        item => item.locale === current.locale
                    );
                    if (!newValueValue || !newValueValue.value) {
                        changes.remove.push(current.locale);
                    }
                }

                // Check new values - see if a translation for locale has been added.
                for (let i = 0; i < newValue.values.length; i++) {
                    const current = newValue.values[i];
                    const oldValueValue = oldValue.values.find(
                        item => item.locale === current.locale
                    );
                    if (!oldValueValue || !oldValueValue.value) {
                        changes.add.push(current.locale);
                    }
                }

                // If there were changes, update the stats.
                if (changes.add.length || changes.remove.length) {
                    const removeCallback = instance.hook("afterSave", async () => {
                        removeCallback();
                        const stats = await I18NStats.load();

                        for (let i = 0; i < changes.add.length; i++) {
                            const current = changes.add[i];
                            stats.incrementTranslationsCount(current);
                        }

                        for (let i = 0; i < changes.remove.length; i++) {
                            const current = changes.remove[i];
                            stats.decrementTranslationsCount(current);
                        }

                        try {
                            console.log("ide savo");
                            await stats.save();
                        } catch (e) {
                            console.log("puklo stari moj");
                            console.log(JSON.stringify(e))
                            console.log(e.data);
                            throw e;
                        }
                    });
                }

                return newValue;
            })(i18nString({ context }))
        }))
    )(createBase());

    return I18NText;
};

import { flow } from "lodash";
import { withStorage, withCrudLogs, withSoftDelete, withFields } from "@webiny/commodo";
import { withUser } from "@webiny/api-security";
import i18NLocale from "./models/i18nLocale.model";
import i18nText from "./models/i18nText.model";
import i18nStats from "./models/i18nStats.model";

export default () => ({
    name: "graphql-context-models",
    type: "graphql-context",
    apply(context) {
        const driver = context.commodo && context.commodo.driver;

        if (!driver) {
            throw Error(
                `Commodo driver is not configured! Make sure you add a Commodo driver plugin to your service.`
            );
        }

        const createBase = () =>
            flow(
                withFields({
                    id: context.commodo.fields.id()
                }),
                withStorage({ driver }),
                withUser(context),
                withSoftDelete(),
                withCrudLogs()
            )();

        const I18NStats = i18nStats({ createBase });
        const I18NText = i18nText({ createBase, context, I18NStats });
        const I18NLocale = i18NLocale({ createBase });

        context.models = {
            I18NLocale,
            I18NText,
            I18NStats,
            createBase
        };
    }
});

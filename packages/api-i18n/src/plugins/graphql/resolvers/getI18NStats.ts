import { I18NContext } from "../../../types";
import { GraphQLContext } from "@webiny/api/types";

type ModelsContext = any;

export default async (
    _: { [key: string]: any },
    args: { [key: string]: any },
    context: I18NContext | GraphQLContext | ModelsContext
) => {
    const {i18n, models} = context;
    const { I18NStats, I18NText } = models;
    const textsCount = await I18NText.count();
    const i18nStats = await I18NStats.load();

    return {
        texts: {
            count: textsCount
        },
        translations: i18nStats.translations.map(item => {
            const locale = i18n.getLocaleById(item.locale);
            if (!locale) {
                return true;
            }

            let percentage = null;
            if (textsCount > 0) {
                percentage = ((item.count / textsCount) * 100).toFixed(2);
            }
            return {
                locale,
                count: item.count,
                percentage
            };
        })
    };
};

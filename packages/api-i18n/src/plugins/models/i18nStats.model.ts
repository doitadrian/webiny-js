import { flow } from "lodash";
import {
    withFields,
    setOnce,
    string,
    fields,
    number,
    withName,
    withStaticProps,
    withProps
} from "@webiny/commodo";

const SETTINGS_KEY = "i18n-stats";

const TranslationsStatsModel = flow(
    withFields({
        locale: string(),
        count: number()
    })
)();

export default ({ createBase }) => {
    return flow(
        withName("Settings"),
        withStaticProps({
            __stats: null,
            async load() {
                if (this.__stats) {
                    return this.__stats;
                }

                let stats = await this.findOne({ query: { key: SETTINGS_KEY } });
                if (!stats) {
                    stats = new this();
                    await stats.save();
                }

                this.__stats = stats;
                return this.__stats;
            }
        }),
        withFields({
            key: setOnce()(string({ value: SETTINGS_KEY })),
            translations: fields({
                list: true,
                value: [],
                instanceOf: TranslationsStatsModel
            })
        }),
        withProps({
            incrementTranslationsCount(locale: string) {
                if (!this.translations.find(item => item.locale === locale)) {
                    this.translations = [
                        ...this.translations,
                        {
                            locale: locale,
                            count: 0
                        }
                    ];
                }

                const stats = this.translations.find(item => item.locale === locale);
                stats.count++;
                return this;
            },
            decrementTranslationsCount(locale: string) {
                if (!this.translations.find(item => item.locale === locale)) {
                    this.translations = [
                        ...this.translations,
                        {
                            locale: locale,
                            count: 0
                        }
                    ];
                }

                const stats = this.translations.find(item => item.locale === locale);
                if (stats.count > 0) {
                    stats.count--;
                }
                return this;
            }
        })
    )(createBase());
};

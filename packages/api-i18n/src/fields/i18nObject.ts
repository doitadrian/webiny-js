import onGetI18NValues from "./onGetI18NValues";
import { onGet, object, fields, withFields, withProps } from "@webiny/commodo";
import { validation } from "@webiny/validation";
import { flow } from "lodash";

export default ({ context, ...rest }) => {
    const { id } = context.commodo.fields;

    return fields({
        ...rest,
        value: {},
        instanceOf: flow(
            withFields({
                values: onGet(value => onGetI18NValues(value, context))(
                    fields({
                        list: true,
                        value: [],
                        instanceOf: withFields({
                            locale: id({ validation: validation.create("required") }),
                            value: object()
                        })()
                    })
                )
            }),
            withProps({
                get value() {
                    const locale = context.i18n.getLocale();
                    const value = this.values.find(value => value.locale === locale.id);
                    return value ? value.value : "";
                }
            })
        )()
    });
};

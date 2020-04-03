// TODO @i18n: use lodash.xyz, check other places just in case.
import _ from "lodash";
import React from "react";
import { Processor } from "@webiny/i18n/types";
import { useI18N } from "./hooks/useI18N";

const processTextPart = (part: string, values: any, modifiers): any => {
    if (!_.startsWith(part, "{")) {
        return part;
    }

    part = _.trim(part, "{}");

    const parts = part.split("|");

    const [variable, modifier] = parts;

    if (!_.has(values, variable)) {
        return variable;
    }

    let value = values[variable];
    if (modifier) {
        const parameters = modifier.split(":");
        const name = parameters.shift();
        if (modifiers[name]) {
            const modifier = modifiers[name];
            value = modifier.execute(value, parameters);
        }
    }

    return value;
};

function I18NTranslation({ data }) {
    const useI18NHook = useI18N();
    if (!useI18NHook) {
        // TODO @i18n: check this, what to do here? Maybe required changes in code organisation.
        return null;
    }
    const parts = data.translation.split(/({.*?})/);
    return (
        <>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {processTextPart(part, data.values, data.i18n.modifiers)}
                </React.Fragment>
            ))}
        </>
    );
}

export default {
    name: "react",
    execute(data) {
        return <I18NTranslation data={data} />;
    }
} as Processor;

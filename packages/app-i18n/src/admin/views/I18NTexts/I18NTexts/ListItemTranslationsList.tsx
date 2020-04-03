import React, { useState } from "react";
import styled from "@emotion/styled";
import { Input } from "@webiny/ui/Input";
import { Form } from "@webiny/form";
import { ListItem, ListItemText } from "@webiny/ui/List";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { Typography } from "@webiny/ui/Typography";
import { Mutation } from "react-apollo";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

import { UPDATE_TEXT } from "../graphql";

import { i18n } from "@webiny/app/i18n";
const t = i18n.ns("app-i18n/admin/i18n-texts/translate-text");

const ListItemTextInnerWrapper = styled("div")({
    padding: "0 0 0 25px"
});

const ListItemLocaleCode = styled("div")({
    display: "inline-block",
    color: "gray",
    minWidth: 40,
    fontSize: 12
});
const NoTranslationLabel = styled("span")({
    color: "gray"
});

const SHORTCUT = navigator.platform === "MacIntel" ? "Cmd + Enter" : "Ctrl + Enter";

const getTranslationForLocale = ({ locale, translations }) => {
    const index = translations.findIndex(item => item.locale === locale.id);
    return [index, index >= 0 ? translations[index].value : null];
};

const TranslationListItem = function({ data, locale }) {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    // TODO @i18n: add support for scanning this: t({...})`Some text...`

    const [initialTranslationIndex, initialTranslation] = getTranslationForLocale({
        locale,
        translations: data.translations.values
    });

    return (
        <ListItem onClick={() => setEditing(true)}>
            <ListItemText>
                <ListItemTextInnerWrapper>
                    {editing ? (
                        <Mutation mutation={UPDATE_TEXT}>
                            {update => (
                                <Form
                                    data={{ translation: initialTranslation }}
                                    onSubmit={async ({ translation }) => {
                                        setLoading(true);
                                        const submissionData = cloneDeep(data);
                                        if (initialTranslationIndex >= 0) {
                                            submissionData.translations.values[
                                                initialTranslationIndex
                                            ].value = translation;
                                        } else {
                                            submissionData.translations.values.push({
                                                locale: locale.id,
                                                value: translation
                                            });
                                        }

                                        const response = get(
                                            await update({
                                                variables: {
                                                    id: submissionData.id,
                                                    data: submissionData
                                                },
                                                refetchQueries: ["ListI18NTexts"],
                                                awaitRefetchQueries: true
                                            }),
                                            "data.i18n.text"
                                        );

                                        if (response.error) {
                                            setLoading(false);
                                            return showSnackbar(response.error.message);
                                        }
                                    }}
                                >
                                    {({ Bind }) => (
                                        <Bind name={"translation"}>
                                            <Input
                                                disabled={loading}
                                                label={locale.code}
                                                rows={2}
                                                outlined
                                                autoFocus
                                                onBlur={() => setEditing(false)}
                                                placeholder={t({
                                                    processor: "string"
                                                })`Press {shortcut} to save translation or Esc to cancel`(
                                                    {
                                                        shortcut: SHORTCUT
                                                    }
                                                )}
                                            />
                                        </Bind>
                                    )}
                                </Form>
                            )}
                        </Mutation>
                    ) : (
                        <>
                            <ListItemLocaleCode>{locale.code}</ListItemLocaleCode>{" "}
                            <Typography use={"body2"}>
                                {initialTranslation || (
                                    <NoTranslationLabel>{t`No translation...`}</NoTranslationLabel>
                                )}
                            </Typography>
                        </>
                    )}
                </ListItemTextInnerWrapper>
            </ListItemText>
        </ListItem>
    );
};

const ListItemTranslationsList = ({ data }) => {
    const { getLocales } = useI18N();
    return getLocales().map(locale => (
        <TranslationListItem key={locale.code} locale={locale} data={data} />
    ));
};

export default ListItemTranslationsList;

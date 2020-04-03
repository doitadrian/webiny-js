import * as React from "react";
import { i18n } from "@webiny/app/i18n";
import { ConfirmationDialog } from "@webiny/ui/ConfirmationDialog";
import { useCrud } from "@webiny/app-admin/hooks/useCrud";
import ListItemTranslationsList from "./I18NTexts/ListItemTranslationsList";
import LocaleStats from "./I18NTexts/LocaleStats";
import { Typography } from "@webiny/ui/Typography";
import { useQuery } from "react-apollo";
import { GET_I18N_STATS } from "./graphql";
import get from "lodash.get";

import {
    DataList,
    ScrollList,
    ListItem,
    ListItemText,
    ListItemMeta,
    ListActions,
    ListItemTextSecondary
} from "@webiny/ui/List";

import { DeleteIcon } from "@webiny/ui/List/DataList/icons";

const t = i18n.ns("app-i18n/admin/texts/data-list");

const I18NTextsDataList = () => {
    const { actions, list } = useCrud();
    const getI18nStats = useQuery(GET_I18N_STATS);
    const translations = get(getI18nStats, "data.i18n.getI18NStats.translations");

    return (
        <DataList {...list} title={t`Texts`}>
            {({ data, isSelected }) => (
                <ScrollList>
                    {Array.isArray(translations) && (
                        <ListItem>
                            <ListItemText>
                                {translations.map(item => (
                                    <LocaleStats
                                        key={item.locale.id}
                                        data={item}
                                    />
                                ))}
                            </ListItemText>
                        </ListItem>
                    )}

                    {data.map(item => (
                        <React.Fragment key={item.id}>
                            <ListItem selected={isSelected(item)}>
                                <ListItemText>
                                    <Typography use={"body1"}>{item.text}</Typography>
                                    <ListItemTextSecondary>{item.namespace}</ListItemTextSecondary>
                                </ListItemText>

                                <ListItemMeta>
                                    <ListActions>
                                        <ConfirmationDialog>
                                            {({ showConfirmation }) => (
                                                <DeleteIcon
                                                    onClick={() =>
                                                        showConfirmation(async () => {
                                                            await actions.delete(item);
                                                        })
                                                    }
                                                />
                                            )}
                                        </ConfirmationDialog>
                                    </ListActions>
                                </ListItemMeta>
                            </ListItem>
                            <ListItemTranslationsList data={item} />
                        </React.Fragment>
                    ))}
                </ScrollList>
            )}
        </DataList>
    );
};

export default I18NTextsDataList;

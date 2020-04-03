import React, { useState, useCallback } from "react";
import { SplitView, LeftPanel } from "@webiny/app-admin/components/SplitView";
import { FloatingActionButton } from "@webiny/app-admin/components/FloatingActionButton";
import { CrudProvider } from "@webiny/app-admin/contexts/Crud";
import I18NTextsDataList from "./I18NTextsDataList";
import { READ_TEXT, LIST_TEXTS, CREATE_TEXT, UPDATE_TEXT, DELETE_TEXT } from "./graphql";
import NewTextDialog from "./NewTextDialog";
import { CircularProgress } from "@webiny/ui/Progress";
import { useApolloClient } from "react-apollo";
import useReactRouter from "use-react-router";
import { useHandler } from "@webiny/app/hooks/useHandler";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";

export default function I18NTexts(props) {
    const [creatingText, setCreatingText] = useState(false);
    const [showTextsDialog, setTextsDialog] = useState(false);
    const client = useApolloClient();
    const { showSnackbar } = useSnackbar();
    const { history } = useReactRouter();

    const openDialog = useCallback(() => setTextsDialog(true), []);
    const closeDialog = useCallback(() => setTextsDialog(false), []);

    const createTextMutation = useHandler(props, () => async text => {
        try {
            setCreatingText(true);
            const res = await client.mutate({
                mutation: CREATE_TEXT,
                variables: { text },
                refetchQueries: ["PbListTexts"],
                awaitRefetchQueries: true
            });
            setCreatingText(false);
            closeDialog();
            const { data } = res.data.i18n.text;
            history.push(`/text-builder/editor/${data.id}`);
        } catch (e) {
            showSnackbar(e.message);
        }
    });

    const onSelect = useCallback(text => {
        createTextMutation(text.id);
    }, []);

    return (
        <>
            <NewTextDialog open={showTextsDialog} onClose={closeDialog} onSelect={onSelect}>
                {creatingText && <CircularProgress label={"Creating text..."} />}
            </NewTextDialog>
            <CrudProvider
                delete={DELETE_TEXT}
                read={READ_TEXT}
                create={CREATE_TEXT}
                update={UPDATE_TEXT}
                list={{
                    query: LIST_TEXTS,
                    variables: { sort: { savedOn: -1 } }
                }}
            >
                {() => (
                    <>
                        <SplitView>
                            <LeftPanel span={12}>
                                <I18NTextsDataList />
                            </LeftPanel>
                        </SplitView>
                        <FloatingActionButton
                            data-testid="new-record-button"
                            onClick={openDialog}
                        />
                    </>
                )}
            </CrudProvider>
        </>
    );
}

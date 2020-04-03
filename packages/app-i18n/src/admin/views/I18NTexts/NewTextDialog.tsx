import React from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { Form } from "@webiny/form";
import { Input } from "@webiny/ui/Input";
import { CREATE_TEXT } from "./graphql";
import get from "lodash.get";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { CircularProgress } from "@webiny/ui/Progress";
import { validation } from "@webiny/validation";

import { i18n } from "@webiny/app/i18n";
import { isValidNamespace } from "@webiny/i18n";
const t = i18n.namespace("Texts.NewTextDialog");

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogOnClose
} from "@webiny/ui/Dialog";
import { ButtonDefault } from "@webiny/ui/Button";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 400,
        minWidth: 400
    }
});

export type NewTextDialogProps = {
    open: boolean;
    onClose: DialogOnClose;
    textsDataList: any;
};

const NewTextDialog: React.FC<NewTextDialogProps> = ({ open, onClose }) => {
    const [loading, setLoading] = React.useState(false);
    const { showSnackbar } = useSnackbar();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={narrowDialog}
            data-testid="fb-new-text-modal"
        >
            <Mutation mutation={CREATE_TEXT}>
                {update => (
                    <Form
                        onSubmit={async data => {
                            setLoading(true);
                            const response = get(
                                await update({
                                    variables: { data },
                                    refetchQueries: ["ListI18NTexts"],
                                    awaitRefetchQueries: true
                                }),
                                "data.i18n.text"
                            );

                            setLoading(false);
                            if (response.error) {
                                return showSnackbar(response.error.message);
                            }
                            showSnackbar("Text saved successfully.");
                            onClose();
                        }}
                    >
                        {({ Bind, submit }) => (
                            <>
                                {loading && <CircularProgress />}
                                <DialogTitle>{t`New text`}</DialogTitle>
                                <DialogContent>
                                    <Bind
                                        name={"namespace"}
                                        validators={value => {
                                            if (!value || typeof value !== "string") {
                                                throw new Error("Value is required.");
                                            }

                                            if (!isValidNamespace(value)) {
                                                throw new Error(
                                                    `Not a valid I18N namespace, can only accept lowercase letters, numbers, forward slashes ("/"), and dashes ("-").`
                                                );
                                            }
                                        }}
                                    >
                                        <Input
                                            placeholder={"Namespace (e.g. my-app/products/form)"}
                                        />
                                    </Bind>
                                    <br />
                                    <br />
                                    <Bind name={"text"} validators={validation.create("required")}>
                                        <Input placeholder={"Text"} />
                                    </Bind>
                                </DialogContent>
                                <DialogActions>
                                    <ButtonDefault onClick={submit}>+ {t`Create`}</ButtonDefault>
                                </DialogActions>
                            </>
                        )}
                    </Form>
                )}
            </Mutation>
        </Dialog>
    );
};

export default NewTextDialog;

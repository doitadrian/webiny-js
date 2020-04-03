import * as React from "react";
import { i18n } from "@webiny/app/i18n";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ButtonPrimary } from "@webiny/ui/Button";
import { Switch } from "@webiny/ui/Switch";
import { CircularProgress } from "@webiny/ui/Progress";
import { useCrud } from "@webiny/app-admin/hooks/useCrud";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { validation } from "@webiny/validation";

const t = i18n.ns("app-i18n/admin/texts/form");

const I18NTextForm = () => {
    const { form: crudForm } = useCrud();
    const { refetchTexts } = useI18N();

    return (
        <Form
            {...crudForm}
            onSubmit={async data => {
                await crudForm.onSubmit(data);
                refetchTexts();
            }}
        >
            {({ data, form, Bind }) => (
                <SimpleForm>
                    {crudForm.loading && <CircularProgress />}
                    <SimpleFormHeader title={data.code || t`New text`} />
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="code" validators={validation.create("required")}>
                                   woot
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="default">
                                    <Switch label={t`Default`} />
                                </Bind>
                            </Cell>
                        </Grid>
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonPrimary onClick={form.submit}>{t`Save text`}</ButtonPrimary>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
};

export default I18NTextForm;

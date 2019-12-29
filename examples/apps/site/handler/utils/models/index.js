// @flow
import { flow } from "lodash";
import { withStorage, withCrudLogs } from "@webiny/commodo";
import ssrCache from "./ssrCache.model";
import { withId, DbProxyDriver } from "@webiny/commodo-fields-storage-db-proxy";

export default () => {
    const createBase = () =>
        flow(
            withId(),
            withStorage({
                driver: new DbProxyDriver({ dbProxyFunctionName: process.env.DB_PROXY_FUNCTION })
            }),
            withCrudLogs()
        )();

    const SsrCache = ssrCache({ createBase });

    return {
        SsrCache
    };
};

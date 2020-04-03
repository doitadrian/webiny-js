import { merge } from "lodash";
import gql from "graphql-tag";
import { emptyResolver } from "@webiny/commodo-graphql";
import { hasScope } from "@webiny/api-security";
import i18nLocale from "./graphql/I18NLocale";
import i18nText from "./graphql/I18NText";
import i18nStats from "./graphql/I18NStats";
import install from "./graphql/Install";
import { GraphQLSchemaPlugin } from "@webiny/api/types";
import { I18NStringValueType, I18NStringValueInput } from "@webiny/api-i18n/graphql";

const plugin: GraphQLSchemaPlugin = {
    type: "graphql-schema",
    name: "graphql-schema-i18n",
    schema: {
        typeDefs: gql`
            ${I18NStringValueType()}
            ${I18NStringValueInput()}

            type I18NQuery {
                _empty: String
            }

            type I18NMutation {
                _empty: String
            }

            extend type Query {
                i18n: I18NQuery
            }

            extend type Mutation {
                i18n: I18NMutation
            }

            type I18NBooleanResponse {
                data: Boolean
                error: I18NError
            }

            type I18NDeleteResponse {
                data: Boolean
                error: I18NError
            }

            type I18NListMeta {
                totalCount: Int
                totalPages: Int
                page: Int
                perPage: Int
                from: Int
                to: Int
                previousPage: Int
                nextPage: Int
            }

            type I18NError {
                code: String
                message: String
                data: JSON
            }
            ${install.typeDefs}
            ${i18nLocale.typeDefs}
            ${i18nText.typeDefs}
            ${i18nStats.typeDefs}
        `,
        resolvers: merge(
            {
                Query: {
                    i18n: emptyResolver
                },
                Mutation: {
                    i18n: emptyResolver
                }
            },
            install.resolvers,
            i18nLocale.resolvers,
            i18nText.resolvers,
            i18nStats.resolvers
        )
    },
    security: {
        shield: {
            I18NQuery: {
                getI18NLocale: hasScope("i18n:locale:crud"),
                listI18NLocales: hasScope("i18n:locale:crud"),
                getI18NText: hasScope("i18n:text:crud"),
                listI18NTexts: hasScope("i18n:text:crud")
                // getI18NInformation // Publicly visible.
                // getI18NStats // Publicly visible.
            },
            I18NMutation: {
                createI18NLocale: hasScope("i18n:locale:crud"),
                updateI18NLocale: hasScope("i18n:locale:crud"),
                deleteI18NLocale: hasScope("i18n:locale:crud"),
                createI18NText: hasScope("i18n:text:crud"),
                updateI18NText: hasScope("i18n:text:crud"),
                deleteI18NText: hasScope("i18n:text:crud")
            }
        }
    }
};

export default plugin;

import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const i18NTextFetcher = ctx => ctx.models.I18NText;

export default {
    typeDefs: `
        input I18NTextSearchInput {
            query: String
            fields: [String]
            operator: String
        }
        
        type I18NText {
            id: ID
            translations: I18NStringValue
            namespace: String
            text: String
            createdOn: DateTime
        }
        
        input I18NTextInput {
            id: ID
            translations: I18NStringValueInput
            namespace: String
            text: String
            createdOn: DateTime
        }
        
        type I18NTextResponse {
            data: I18NText
            error: I18NError
        }
        
        type I18NTextListResponse {
            data: [I18NText]
            meta: I18NListMeta
            error: I18NError
        }
        
        extend type I18NQuery {
            getI18NText(
                id: ID 
            ): I18NTextResponse
            
            listI18NTexts(
                page: Int
                perPage: Int
                where: JSON
                sort: JSON
                search: I18NTextSearchInput
            ): I18NTextListResponse   
        }
        
        extend type I18NMutation {
            createI18NText(
                data: I18NTextInput!
            ): I18NTextResponse
            
            updateI18NText(
                id: ID!
                data: I18NTextInput!
            ): I18NTextResponse
        
            deleteI18NText(
                id: ID!
            ): I18NDeleteResponse
        }
    `,
    resolvers: {
        I18NQuery: {
            getI18NText: resolveGet(i18NTextFetcher),
            listI18NTexts: resolveList(i18NTextFetcher),
        },
        I18NMutation: {
            createI18NText: resolveCreate(i18NTextFetcher),
            updateI18NText: resolveUpdate(i18NTextFetcher),
            deleteI18NText: resolveDelete(i18NTextFetcher)
        }
    }
};

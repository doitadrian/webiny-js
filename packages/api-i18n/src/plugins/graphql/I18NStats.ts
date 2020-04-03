import getI18NStats from "./resolvers/getI18NStats";

export default {
    typeDefs: /* GraphQL */ `
        type I18NStatsTexts {
            count: Int
        }
        
        type I18NStatsLocale {
            code: String
            id: ID
        }
        
        type I18NStatsTranslations {
            locale: I18NStatsLocale
            count: Int
            percentage: Float
        }

        type I18NStatsResponse {
            texts: I18NStatsTexts
            translations: [I18NStatsTranslations]
        }
        extend type I18NQuery {
            getI18NStats: I18NStatsResponse
        }
    `,
    resolvers: {
        I18NQuery: {
            getI18NStats
        }
    }
};

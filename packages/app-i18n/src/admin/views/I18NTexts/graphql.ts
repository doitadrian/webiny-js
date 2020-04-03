import gql from "graphql-tag";

const BASE_FIELDS = /* GraphQL */ `
    id
    translations {
        values {
            value
            locale
        }
    }
    namespace
    text
    createdOn
`;

export const LIST_TEXTS = gql`
    query ListI18NTexts(
        $where: JSON
        $sort: JSON
        $page: Int
        $perPage: Int
        $search: I18NTextSearchInput
    ) {
        i18n {
            I18NTexts: listI18NTexts(
                where: $where
                sort: $sort
                page: $page
                perPage: $perPage
                search: $search
            ) {
                data {
                    ${BASE_FIELDS}
                }
                meta {
                    totalCount
                    to
                    from
                    nextPage
                    previousPage
                }
            }
        }
    }
`;

export const GET_I18N_STATS = gql`
    query GetI18NStats {
        i18n {
            getI18NStats {
                translations {
                    count
                    locale {
                        id
                        code
                    }
                    percentage
                }
            }
        }
    }
`;

export const READ_TEXT = gql`
    query getText($id: ID!) {
        i18n {
            text: getI18NText(id: $id){
                data {
                    ${BASE_FIELDS}
                }
                error {
                    code
                    message
                }
            }
        }
    }
`;

export const CREATE_TEXT = gql`
    mutation createI18NText($data: I18NTextInput!){
        i18n {
            text: createI18NText(data: $data) {
                data {
                    ${BASE_FIELDS}
                }
                error {
                    code
                    message
                    data
                }
            }
        }
    }
`;

export const UPDATE_TEXT = gql`
    mutation updateI18NText($id: ID!, $data: I18NTextInput!){
        i18n {
            text: updateI18NText(id: $id, data: $data) {
                data {
                    ${BASE_FIELDS}
                }
                error {
                    code
                    message
                    data
                }
            }
        }
    }
`;

export const DELETE_TEXT = gql`
    mutation deleteI18NText($id: ID!) {
        i18n {
            deleteI18NText(id: $id) {
                data
                error {
                    code
                    message
                }
            }
        }
    }
`;

export const SEARCH_TEXT_CODES = gql`
    query searchTextCodes($search: String!) {
        i18n {
            codes: searchTextCodes(search: $search) {
                data
            }
        }
    }
`;

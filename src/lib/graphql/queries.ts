import { gql } from '@apollo/client';

export const GET_DOCUMENTS = `gql
query GetDocuments {
    data {
        document {
            id,
            name,
            type,
            children{
                id,
                name,
                type
            }
        }
    }
}
`

export const GET_DOCUMENT_NODES = `gql
query GetDocumentNodes() {
    data {
        document {
            id,
            name,
            type,
            children{
                id,
                name,
                type,
            }
        }
    }
}
`
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

export const GET_DOCUMENT_NODES_BY_ID = `gql
query GetDocumentNodesById($id: ID!) {
    data {
        document(id: $id) {
            id,
            name,
            type,
            children{
                id,
                name,
                type,
                children {
                    id,
                    name,
                    type
                }
            }
        }
    }
}
`
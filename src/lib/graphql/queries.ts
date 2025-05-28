import { gql } from '@apollo/client';


export const GET_FIGMA_FILE_BY_KEY = gql`
query TestFigmaFileByKey($fileKey: String!) {
  figmaFileByKey(fileKey: $fileKey) {
    fileKey
    message
    status
    data {
      document {
        id
        name
        type
        children {
          id
          name
          type
        }
      }
      name
      version
      role
      lastModified
      thumbnailUrl
    }
  }
}
`

export const GET_FIGMA_FILE_DATA = gql`
query TestFigmaFileData($fileKey: String!) {
  figmaFileData(fileKey: $fileKey) {
    fileKey
    message
    status
    data
  }
}
`
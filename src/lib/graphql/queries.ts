import { gql } from '@apollo/client';


export const GET_FIGMA_FILE_BY_KEY = gql`
query TestFigmaFileByKey($fileKey: String!) {
  figmaFileByKey(fileKey: $fileKey) {
    fileKey
    message
    status
    data
  }
}
`

export const GET_FIGMA_FILE_DATA = gql`
query TestFigmaFileData($fileKey: String!) {
  figmaFileData(fileKey: $fileKey)
}
`;
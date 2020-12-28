import gql from "graphql-tag";

//query to posts through graphql
export const FETCH_POSTS_QUERY = gql `
query {
  getPosts {
    id,
    body,
    createdAt,
    username,
    likeCount,
    likes {
      username
    },
    commentCount,
    comments {
      id username createdAt body
    }
  }
}
`;

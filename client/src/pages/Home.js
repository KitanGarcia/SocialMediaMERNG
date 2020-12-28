import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

function Home() {
  //loading is true when loading
  //data contains post after using query
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  //ternary shows loading posts when loading and all the posts otherwise
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts... </h1>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20}}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
  /*
  */
}

//query to posts through graphql
const FETCH_POSTS_QUERY = gql `
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

export default Home;

import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);

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
        {
          //if user is logged in
          user && (
          <Grid.Column>
            <PostForm/>
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts... </h1>
        ) : (
          <Transition.Group>
          {data.getPosts &&
            data.getPosts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 20}}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home;

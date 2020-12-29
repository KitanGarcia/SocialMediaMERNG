import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

//destructure props to use postId
function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    //we reach update when post has been deleted successfully
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      //keep posts that don't have the same ID as the one just deleted
      data.getPosts = data.getPosts.filter(post => post.id !== postId);
      proxy.writeQuery({query: FETCH_POSTS_QUERY, data});


      if (callback) {
        callback();
      }
    },
    variables: {
      postId
    }
  });

  //wrap two siblings in a fragment so it can be returned
  return (
    <>
      <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
        <Icon name="trash" style={{margin: 0}} />
      </Button>
      {/*onCancel is when you decline confirmation to delete. onConfirm is when you confirm and delete it*/}
      <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePost} />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton

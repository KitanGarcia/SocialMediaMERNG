import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql  from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";

function LikeButton({ user, post: { id, likeCount, likes}}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    //if likes in post have current username, that user has liked the post
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    }
    else {
      setLiked(false);
    }
  }, [user, likes]); //dependency array. if any are changed, recalculate the value


  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {postId: id}
  });

  //if we've liked the button, fill it in. Otherwise keep it basic (not filled)
  //if not logged in, redirect to login page when button is clicked
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
        <Button as='div' labelPosition='right' onClick={likePost}>
          {likeButton}
          <Label as='a' basic color='teal' pointing='left'>
            {likeCount}
          </Label>
        </Button>
  );
}

//mutation takes in required post id and triggers likePost mutation
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id,
      likes {
        id,
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;

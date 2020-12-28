import React from 'react';
import { Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import moment from "moment";

function PostCard({ post: {body, createdAt, id, username, likeCount, commentCount, likes, comments }}) {
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}> {moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <p>buttons here</p>
      </Card.Content>
    </Card>
  )
}

//fluid makes the cards take up more space to fit the container

//setting fromNow(true) in moment removes ago. Ie. 5 days ago becomes 5 days



export default PostCard;

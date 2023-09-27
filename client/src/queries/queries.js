import gql from 'graphql-tag'

//SUBSCRIPTIONS
export const USER_CONNECTED= gql`
subscription{
  user_Connected {
    username
  }
}
`

//USER QUERIES
export const NOTIFICATIONS=gql`
query GetNotifications($userId: String!) {
  getNotifications(userId: $userId) {
    message
    read
    _id
    avatar 
    icon
  }
}
`

export const GET_CURRENT_USER= gql`
query {
getCurrentUser{
_id
username
password
email
avatar
joinDate
followers{
  Followers
  peopleFollowers{
    _id
    username
    avatar
  }
}
following{
  Following
  peopleFollowing{
    _id
    username
    avatar
  }
}
}
}
`;

// USER MUTATIONS
export const SIGNIN_USER= gql`
mutation($username: String!, $password: String!)  {
  signinUser(username: $username, password: $password) {
  token  
  }
}
`;

export const CREATE_USER= gql`
mutation($username: String!, $email: String!, $password: String!)  {
  createUser(username: $username, email: $email, password: $password) {
  token  
  }
}
`;

export const FOLLOW_USER=gql`
mutation Follow($userId: ID!, $usertoFollowId: ID!) {
  follow(userId: $userId, usertoFollowId: $usertoFollowId) {
    _id
    username
    avatar
    following {
      peopleFollowing {
        username
        _id
        avatar
      }
      Following
    }
    followers {
      peopleFollowers {
        username
        _id
        avatar
      }
      Followers
    }
  }
}
`

//POST QUERIES
export const SEARCH_POSTS=gql`
 query($searchTerm: String){
  searchPosts(searchTerm:$searchTerm){
    _id
    message
    likes{
      Likes
      likedBy{
        _id
        username
        avatar
      }
    }
    createdBy{
      _id
      username
      avatar
    }
    comments {
      _id
      messageBody
      messageDate
      messageUser {
        username
        _id
        avatar
      }
    }
  }
 }
`


export const GET_POSTS=gql`
query Query {
  getPosts {
    message
    likes {
      likedBy {
        username
        _id
        avatar
      }
      Likes
    }
    createdDate
    createdBy {
      username
      _id
      avatar
    }
    comments {
      _id
      messageBody
      messageDate
      messageUser {
        username
        _id
        avatar
      }
    }
    _id
  }
}
`;
export const GET_POSTS_BY_USER=gql`
query GetPosts($userId: ID!) {
  getPostsByUser(userId: $userId) {
    message
    likes {
      likedBy {
        username
        avatar
        _id
      }
      Likes
    }
    createdDate
    createdBy {
      username
      avatar
      _id
    }
    comments {
      _id
      messageBody
      messageDate
      messageUser {
        username
        _id
        avatar
      }
    }
    _id
  }
}
`;

//POST MUTATIONS
export const DELETE_POST=gql`
mutation DeletePost($postId: ID!, $userId: ID!) {
  deletePost(postId: $postId, userId: $userId)
}
`;
export const ADD_COMMENT=gql`
mutation AddComment($postId: ID!, $userId: ID!, $message: String!) {
  addComment(postId: $postId, userId: $userId, message: $message) {
    messageBody
    messageUser {
      username
      _id
      avatar
    }
    _id
    messageDate
  }
}
`;
export const ADD_POST=gql`
mutation AddPost($message: String!, $userId: ID!) {
  addPost(message: $message, userId: $userId) {
    message
    likes{
      Likes
      likedBy{
        _id  
        username
        avatar
      }
    }
    createdDate
    createdBy {
      _id
      username
      avatar
    }
    comments {
      _id
      messageBody
      messageDate
      messageUser {
        username
        _id
        avatar
      }
    }
    _id
  }
}
`

export const LIKE_POST=gql`
mutation Like($postId: ID!, $userId: ID!) {
  like(postId: $postId, userId: $userId) {
    createdDate
    message
    likes {
      likedBy {
        avatar
        _id
        username
      }
      Likes
    }
    _id
    createdBy {
      username
      avatar
      _id
    }
  }
}
`;

export const USERS_TO_CHAT=gql`
query Get_users_to_chat($userId: ID!) {
  get_users_to_chat(userId: $userId) {
    _id
    username
    email
    avatar
  }
}
`;

export const GET_CHATS=gql`
query Get_chats($userId: ID!) {
  get_chats(userId: $userId) {
    _id
    user1{
       _id
       username
       avatar
    }
    user2{
      _id
      username
      avatar
    }
    messages{
      _id
      messageBody
      messageDate
      messageUser {
        username
        _id
        avatar
      }
    }
  }
}
`;
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAuthor = /* GraphQL */ `
  subscription OnCreateAuthor {
    onCreateAuthor {
      id
      name
      signature
      posts {
        items {
          id
          content
          authorID
          ref
          createdAt
        }
        nextToken
      }
    }
  }
`;
export const onUpdateAuthor = /* GraphQL */ `
  subscription OnUpdateAuthor {
    onUpdateAuthor {
      id
      name
      signature
      posts {
        items {
          id
          content
          authorID
          ref
          createdAt
        }
        nextToken
      }
    }
  }
`;
export const onDeleteAuthor = /* GraphQL */ `
  subscription OnDeleteAuthor {
    onDeleteAuthor {
      id
      name
      signature
      posts {
        items {
          id
          content
          authorID
          ref
          createdAt
        }
        nextToken
      }
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      id
      content
      authorID
      author {
        id
        name
        signature
        posts {
          nextToken
        }
      }
      ref
      createdAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      id
      content
      authorID
      author {
        id
        name
        signature
        posts {
          nextToken
        }
      }
      ref
      createdAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      id
      content
      authorID
      author {
        id
        name
        signature
        posts {
          nextToken
        }
      }
      ref
      createdAt
    }
  }
`;

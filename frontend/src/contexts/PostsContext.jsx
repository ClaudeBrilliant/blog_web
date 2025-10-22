import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  return (
    <PostsContext.Provider value={{ posts, setPosts, categories, setCategories }}>
      {children}
    </PostsContext.Provider>
  );
};

import { useQuery } from "@tanstack/react-query";
import React from "react";

const Posts = () => {
  useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      fetch(
        "https://1nfeptcyqh.execute-api.us-east-1.amazonaws.com/prod/"
      ).then((res) => res.json()),
    enabled: false,
  });

  return (
    <div>
      <h1>Posts</h1>
      <p>Posts</p>
    </div>
  );
};

export default Posts;

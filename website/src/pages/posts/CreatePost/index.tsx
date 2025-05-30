import { Stack, TextField } from "@mui/material";
import { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [movie, setMove] = useState("");

  return (
    <Stack spacing={2}>
      <TextField
        label="Title"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
        variant="standard"
      />
    </Stack>
  );
};

export default CreatePost;

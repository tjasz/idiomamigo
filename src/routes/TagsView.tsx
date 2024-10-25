import React, { useState } from "react";
import { useCreateTagMutation, useListTagsQuery } from "../redux-api";
import { Link } from "react-router-dom";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function TagsView() {
  const { data, error, isLoading } = useListTagsQuery();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();
  const [newTagName, setNewTagName] = useState<string | undefined>(undefined);

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return <div>
    <h1>Tags</h1>
    <ul>
      {data && data.map(tag => <li>
        <Link to={`${tag.Name}`}>{tag.Name}</Link>
      </li>)}
    </ul>
    <label htmlFor="newTagName">Create New Tag:</label>
    <input type="text" id="newTagName" onChange={event => setNewTagName(event.target.value)} />
    <button disabled={isCreatingTag} onClick={() => {
      if (newTagName === undefined) {
        alert("Tag name required to create a new tag.")
      } else {
        createTag({ Name: newTagName })
      }
    }}>Create</button>
  </div>
}
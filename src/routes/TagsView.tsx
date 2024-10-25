import React from "react";
import { useListTagsQuery } from "../redux-api";
import { Link } from "react-router-dom";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function TagsView() {
  const { data, error, isLoading } = useListTagsQuery();

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
  </div>
}
import React from "react";
import { useListLanguagesQuery } from "../redux-api";
import { Link } from "react-router-dom";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function LanguagesView() {
  const { data, error, isLoading } = useListLanguagesQuery();

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return <div>
    <h1>Languages</h1>
    <ul>
      {data && data.map(lang => <li>
        <Link to={`${lang.Name}`}>{lang.Name}</Link>
      </li>)}
    </ul>
  </div>
}
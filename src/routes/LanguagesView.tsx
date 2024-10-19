import React from "react";
import { useListLanguagesQuery } from "../redux-api";
import { Link } from "react-router-dom";

export function LanguagesView() {
  const { data, error, isLoading } = useListLanguagesQuery();

  return <div>
    <h1>Languages</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {data && data.map(lang => <li>
        <Link to={`${lang.Name}`}>{lang.Name}</Link>
      </li>)}
    </ul>
  </div>
}
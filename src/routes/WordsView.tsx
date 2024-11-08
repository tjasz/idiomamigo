import React from "react";
import { useListWordsQuery } from "../redux-api";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";
import { DataTable } from "../DataTable";

export function WordsView() {
  const { data, error, isLoading } = useListWordsQuery();

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!data) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    <h1>Words</h1>
    <DataTable />
  </div>
}
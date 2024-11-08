import React from "react";
import { useDeleteWordMutation, useListWordsQuery } from "../redux-api";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";
import { DataTable } from "../DataTable";

export function WordsView() {
  const { data, error, isLoading } = useListWordsQuery();

  // TODO show error if delete fails (may be due to being part of a PhraseMembership or other relation)
  const [deleteWord, { isLoading: isDeletingWord }] = useDeleteWordMutation();

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
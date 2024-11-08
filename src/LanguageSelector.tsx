import { FC } from "react";
import { Language } from "./types";
import { useListLanguagesWithParametersQuery } from "./redux-api";
import { Autocomplete, LinearProgress, TextField } from "@mui/material";
import ApiError from "./ApiError";
import React from "react";

export interface ILanguageSelectorProps {
  onChange: (value: Language | undefined) => void,
  disabledLanguages?: Set<string>,
};
export const LanguageSelector: FC<ILanguageSelectorProps> = ({ onChange, disabledLanguages }) => {
  const disabledLanguagesFilter = [...disabledLanguages ?? new Set([])].map(name => `Name ne '${name}'`).join(" and ");
  const { data, isLoading: languagesLoading, error: languagesError } = useListLanguagesWithParametersQuery(
    disabledLanguagesFilter.length > 0
      ? {
        $orderby: "Name",
        $filter: disabledLanguagesFilter
      }
      : {
        $orderby: "Name"
      }
  );

  if (languagesLoading) {
    return <LinearProgress />
  }

  if (languagesError) {
    return <ApiError error={languagesError} />
  }

  if (!data) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    <Autocomplete
      options={data.value}
      getOptionLabel={option => option.Name}
      renderInput={(params) => <TextField {...params} label="Select Language..." />}
      onChange={(ev, value) => onChange(value ?? undefined)}
    />
  </div>
}
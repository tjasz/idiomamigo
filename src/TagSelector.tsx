import { FC, useState } from "react";
import { Tag } from "./types";
import { useListTagsQuery } from "./redux-api";
import { LinearProgress } from "@mui/material";
import ApiError from "./ApiError";
import React from "react";

interface ITagSelectorProps {
  onConfirm: (value: Tag) => void,
  disabledTagnames: Set<string>,
};
export const TagSelector: FC<ITagSelectorProps> = ({ onConfirm, disabledTagnames }) => {
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useListTagsQuery();
  const [tag, setTag] = useState<Tag | undefined>(undefined);

  if (tagsLoading) {
    return <LinearProgress />
  }

  if (tagsError) {
    return <ApiError error={tagsError} />
  }

  return <div>
    <select onChange={event => setTag(tags?.[parseInt(event.target.value)])}>
      <option value={undefined} disabled selected><em>Select...</em></option>
      {tags?.map((tag, index) => <option key={index} value={index} disabled={disabledTagnames.has(tag.Name)}>
        {tag.Name}
      </option>)}
    </select>
    <button onClick={() => {
      if (tag === undefined) {
        alert("Tag name must be defined to confirm.")
      } else {
        onConfirm(tag)
      }
    }}>Confirm</button>
  </div>
}

export default TagSelector;
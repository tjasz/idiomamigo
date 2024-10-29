import { Link } from "react-router-dom";
import { Tag } from "./types";
import { FC, useState } from "react";
import React from "react";
import { CircularProgress, Dialog, DialogTitle } from "@mui/material";
import TagSelector from "./TagSelector";


interface ITagDetailsParams { tags: Tag[], onAttachTag: (tagName: string) => void, isAttaching: boolean };

export const TagDetails: FC<ITagDetailsParams> = ({ tags, onAttachTag, isAttaching }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return <div>
    <h2>Tags:</h2>
    <ul>
      {tags.map(tag => <li key={tag.Name}>
        <Link to={`/Tags/${tag.Name}`}>{tag.Name}</Link>
      </li>)}
    </ul>
    <button onClick={() => setDialogOpen(true)}>Add</button>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Attach Tag</DialogTitle>
      {isAttaching
        ? <CircularProgress />
        : <TagSelector disabledTagnames={new Set(tags.map(tag => tag.Name))} onConfirm={(value: Tag) => {
          onAttachTag(value.Name);
          setDialogOpen(false);
        }} />
      }
    </Dialog>
  </div>
}

export default TagDetails;
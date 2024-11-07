import { FC, useState } from "react";
import { useListWordsWithPaginationQuery } from "./redux-api";
import ApiError from "./ApiError";
import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export interface IDataTableProps {

}
export const DataTable: FC<IDataTableProps> = ({ }) => {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [spelling, setSpelling] = useState<string | undefined>(undefined);

  const languageFilter = language ? `Language ge '${language}' and Language le '${language}zzz'` : undefined;
  const spellingFilter = spelling ? `Spelling ge '${spelling}' and Spelling le '${spelling}zzz'` : undefined;

  const { data, error, isLoading } = useListWordsWithPaginationQuery(
    (languageFilter || spellingFilter)
      ? {
        $filter: [languageFilter, spellingFilter].filter(f => !!f).join(" and "),
        $orderby: "Language,Spelling,Creation"
      } : {
        $orderby: "Language,Spelling,Creation"
      });

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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Language</TableCell>
            <TableCell>Spelling</TableCell>
            <TableCell>Creation</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField
                label="Language"
                onChange={(event) => setLanguage(event.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                label="Spelling"
                onChange={(event) => setSpelling(event.target.value)}
              />
            </TableCell>
            <TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.value.map(word => <TableRow key={word.Id}>
            <TableCell><Link to={`/Languages/${word.Language}`}>{word.Language}</Link></TableCell>
            <TableCell><Link to={word.Id.toString()}>{word.Spelling}</Link></TableCell>
            <TableCell>{word.Creation.toLocaleString()}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
}
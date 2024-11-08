import { FC, useState } from "react";
import { useCreateWordMutation, useListWordsWithParametersQuery } from "./redux-api";
import ApiError from "./ApiError";
import { Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";

export interface IDataTableProps {

}
export const DataTable: FC<IDataTableProps> = () => {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [spelling, setSpelling] = useState<string | undefined>(undefined);
  const [orderby, setOrderBy] = useState<string[]>(["Language", "Spelling", "Creation"]);

  const languageFilter = language ? `Language ge '${language}' and Language le '${language}zzz'` : undefined;
  const spellingFilter = spelling ? `Spelling ge '${spelling}' and Spelling le '${spelling}zzz'` : undefined;
  const orderByParameter = orderby.join(",");

  const { data, error, isLoading } = useListWordsWithParametersQuery(
    (languageFilter || spellingFilter)
      ? {
        $filter: [languageFilter, spellingFilter].filter(f => !!f).join(" and "),
        $orderby: orderByParameter
      } : {
        $orderby: orderByParameter
      });
  const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();

  function prependToOrderBy(colName: string) {
    setOrderBy(currentOrderBy => {
      if (currentOrderBy.length < 1) {
        return [colName];
      }

      // if it has no "desc" suffix, add one
      if (currentOrderBy[0] === colName) {
        return [`${colName} desc`, ...currentOrderBy.slice(1)]
      }

      return [colName, ...currentOrderBy.filter(v => !v.startsWith(colName))]
    });
  }

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
            <TableCell onClick={() => prependToOrderBy("Language")}>Language</TableCell>
            <TableCell onClick={() => prependToOrderBy("Spelling")}>Spelling</TableCell>
            <TableCell onClick={() => prependToOrderBy("Creation")}>Creation</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <LanguageSelector
                onChange={value => setLanguage(value?.Name)}
              />
            </TableCell>
            <TableCell>
              <TextField
                label="Spelling"
                onChange={(event) => setSpelling(event.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                disabled={isCreatingWord || data.value.length > 0}
                onClick={() => {
                  if (language === undefined || spelling === undefined) {
                    alert("Language and spelling required to create a word.")
                  } else {
                    createWord({
                      Language: language,
                      Spelling: spelling,
                      Creation: new Date(),
                    });
                    setSpelling(undefined);
                  }
                }}
              >
                Create
              </Button>
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
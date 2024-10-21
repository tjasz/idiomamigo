import React from "react";
import { useListWordsQuery } from "../redux-api";
import { Link } from "react-router-dom";

export function WordsView() {
  const { data, error, isLoading } = useListWordsQuery();

  return <div>
    <h1>Words</h1>
    <table>
      <tbody>
        <tr>
          <th>Language</th>
          <th>Spelling</th>
          <th>Creation</th>
        </tr>
        {isLoading && "..."}
        {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
        {data && data.map(word => <tr key={word.Id}>
          <td><Link to={`/Languages/${word.Language}`}>{word.Language}</Link></td>
          <td><Link to={word.Id.toString()}>{word.Spelling}</Link></td>
          <td>{word.Creation.toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
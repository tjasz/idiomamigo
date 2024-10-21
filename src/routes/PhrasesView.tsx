import React from "react";
import { useListPhrasesQuery } from "../redux-api";
import { Link } from "react-router-dom";

export function PhrasesView() {
  const { data, error, isLoading } = useListPhrasesQuery();

  return <div>
    <h1>Phrases</h1>
    <table>
      <tbody>
        <tr>
          <th>Language</th>
          <th>Spelling</th>
          <th>Creation</th>
        </tr>
        {isLoading && "..."}
        {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
        {data && data.map(phrase => <tr key={phrase.Id}>
          <td><Link to={`/Languages/${phrase.Language}`}>{phrase.Language}</Link></td>
          <td><Link to={phrase.Id.toString()}>{phrase.Spelling}</Link></td>
          <td>{phrase.Creation.toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
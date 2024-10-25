import React, { FC } from "react";

export interface IApiErrorProps {
  error: unknown;
}

export const ApiError: FC<IApiErrorProps> = ({ error }) => {
  return <span style={{ color: 'red' }}>
    {JSON.stringify(error, undefined, 4)}
  </span>
}

export default ApiError;
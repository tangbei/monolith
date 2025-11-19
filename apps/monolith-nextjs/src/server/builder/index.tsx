"use client";

import { builderAPI } from "./api";

const ServerBuilder = ({ children }: Readonly<{ children: React.ReactNode }>) => {

  builderAPI();

  return children;
};

export default ServerBuilder;
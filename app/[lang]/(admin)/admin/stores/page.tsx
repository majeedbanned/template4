import React from "react";
import { PageWrapper } from "../../components/PageWrapper";
import Datalist from "./components/Datalist";

type Props = {};

export default function students({}: Props) {
  return (
    <PageWrapper>
      <Datalist></Datalist>
    </PageWrapper>
  );
}

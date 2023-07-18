import Datalist from "@/components/admin/datalist/Datalist";
import React from "react";
import { PageWrapper } from "../../components/PageWrapper";

type Props = {};

export default function students({}: Props) {
  return (
    <PageWrapper>
      <Datalist></Datalist>
    </PageWrapper>
  );
}

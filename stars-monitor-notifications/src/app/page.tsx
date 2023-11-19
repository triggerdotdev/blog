"use server";

import Main from "@/components/main";
import {getList} from "../../helper/get.list";

export default async function Home() {
  const list: any[] = await getList();
  return (
      <Main list={list} />
  )
}

import {getList} from "@openai-assistant/helper/get.list";
import Main from "@openai-assistant/components/main";

export default async function Home() {
  const list = await getList();
  return (
     <Main list={list} />
  )
}

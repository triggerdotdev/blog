import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEventRunDetails } from "@trigger.dev/react";

export default function Result() {
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const { isLoading, isError, data, error } = useEventRunDetails(eventId);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Head>
        <title>Your avatar</title>
      </Head>
      <h2 className="font-bold text-3xl mb-2">Thank you! 🌟</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        data?.tasks?.map((task) => (
          <div className="flex gap-2 items-center">
            {task.status === "ERRORED"
              ? "⛔️"
              : task.status === "COMPLETED"
              ? "✅"
              : "⏳"}
            <div className="flex gap-1.5 items-center">
              <h4 className="text-base">{task.displayKey ?? task.name}</h4>
            </div>
          </div>
        ))
      )}

      {data?.output ? (
        data.output.image ? (
          <img src={data.output.image} className="w-1/2 my-4" />
        ) : (
          <p>{JSON.stringify(data.output, null, 2)}</p>
        )
      ) : (
        <></>
      )}

      <p className="mb-4 text-center">
        Your image will be delivered to your email, once it is ready! 💫
      </p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
      >
        Generate another
      </Link>
    </div>
  );
}

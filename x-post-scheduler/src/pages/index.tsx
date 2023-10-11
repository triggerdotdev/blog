import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

 const getTwitterOauthUrl = () => {
	const rootUrl = "https://twitter.com/i/oauth2/authorize";
	const options = {
		redirect_uri: "http://www.localhost:3000/dashboard",
		client_id: process.env.TWITTER_CLIENT_ID!,
		state: "state",
		response_type: "code",
		code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
		code_challenge_method: "S256",
		scope: ["users.read", "tweet.read", "tweet.write"].join(" "),
	};
	const qs = new URLSearchParams(options).toString();
	return `${rootUrl}?${qs}`;
};
  
//   useEffect(() => {
//     if (localStorage.getItem("username")) {
//       return router.push("/dashboard")
//   }
// }, [router])

  return (
    <main
      className={`flex items-center flex-col justify-center min-h-screen ${inter.className}`}
    >
      <h2 className='font-bold text-2xl '>X Scheduler</h2>
      <p className='mb-3 text-md'>Get started and schedule posts</p>
      <Link href={getTwitterOauthUrl()} className='bg-blue-500 py-3 px-4 text-gray-50 rounded-lg'>Sign in with Twitter</Link>
    </main>
  )
}

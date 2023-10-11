import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../supabaseClient';
const BasicAuthToken = Buffer.from(`${process.env.TWITTER_CLIENT_ID!}:${process.env.TWITTER_CLIENT_SECRET!}`, "utf8").toString(
        "base64"
     );
const twitterOauthTokenParams = {
    client_id: process.env.TWITTER_CLIENT_ID!,
    code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
    redirect_uri: `http://www.localhost:3000/dashboard`,
    grant_type: "authorization_code",
};
    
//gets user access token
export const fetchUserToken = async (code: string) => {
    try { 
        const formatData = new URLSearchParams({ ...twitterOauthTokenParams, code })
             const getTokenRequest = await fetch("https://api.twitter.com/2/oauth2/token", {
                 method: "POST",
                 body: formatData.toString(),
                 headers: {
                     "Content-Type": "application/x-www-form-urlencoded",
                     Authorization: `Basic ${BasicAuthToken}`,
                 },
             });
        const getTokenResponse = await getTokenRequest.json()
        return getTokenResponse
    } catch (err) {
        return null
    }
}
//gets user's data from the access token
export const fetchUserData = async (accessToken: string) => {
    try { 
        const getUserRequest = await fetch("https://api.twitter.com/2/users/me", {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })
        const getUserProfile = await getUserRequest.json()
        return getUserProfile
    } catch (err) {
        return null
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { code } = req.body
        try { 
            const tokenResponse = await fetchUserToken(code)
            const accessToken = tokenResponse.access_token
            
            if (accessToken) {
                const userDataResponse = await fetchUserData(accessToken)
                const userCredentials = { ...tokenResponse, ...userDataResponse };
                console.log("CR>>", { accessToken: userCredentials.access_token, _id: userCredentials.data.id, username: userCredentials.data.username })

                const { data, error } = await supabase.from("users").insert({
                    id: userCredentials.data.id,
                    accessToken: userCredentials.access_token,
                    username: userCredentials.data.username
                });
                if (!error) {
                    return res.status(200).json(userCredentials)
                    
                } else {
                    return res.status(400).json({error})
                }         
            }

        } catch (err) {
            return res.status(400).json({err})
        }
}
    
    

    


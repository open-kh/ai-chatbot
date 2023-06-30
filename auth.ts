// import { v4 as uuid } from "uuid";
// import GitHub from 'next-auth/providers/github'
import NextAuth from 'next-auth'
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from 'next/server';
import { uuidv4 } from '@/ai/keys';

const backendURL = process.env.NEXTAUTH_URL??"http://openkh.org"

async function getUser(credentialDetails: any){
    let user = {
        id: 1,
        name: 'Open Brain',
        email: 'openbrain@gmail.com',
        image: '/favicon.ico',
        password: '123456'
    }
    if(credentialDetails.password != 123456) return NextResponse.json({is_success: false});
    return NextResponse.json({is_success: true,...user, ...credentialDetails,id: credentialDetails.email.replaceAll(' ','').toLowerCase()})
}

export const authOptions = {
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    trustHost: true,
    providers: [
        Credentials({
            name: "SignIn",
            type: "credentials",
            credentials: {
                name: { label: "Username", type: "text" },
                email: { label: "Email", type: "email"},
                password: { label: "Password", value: "123456", type: "password", placeholder: "Password defaults 123456"},
            },
            // redirect: false,
            async authorize(credentials) {
                const credentialDetails = {
                    email: credentials.email,
                    password: credentials.password,
                    name: credentials.name,
                };
                // const resp = await fetch(backendURL+"/api/auth/login", {
                //     method: "POST",
                //     headers: {
                //         Accept: "application/json",
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify(credentialDetails),
                // });
                const resp = await getUser(credentialDetails);
                let user = await resp.json()
                if (user.is_success) {
                    return user;
                } else {
                    console.log("check your credentials");
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // @ts-ignore
        jwt: async ({ token, user }) => {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.id = user.id;
            }
            return token;
        },
        // @ts-ignore
        session: async ({ session, token, user }) => {
            if (token) {
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.id = token.id;
            }
            return session;
        },
        // @ts-ignore
        // redirect: async (url, baseUrl) => {
        //     return await Promise.resolve(process.env.REDIRECT_URL);
        //     return url.startsWith(baseUrl)
        //     ? Promise.resolve(url)
        //     : Promise.resolve(baseUrl)
        // }
    },
};

export const {
    handlers: { GET, POST },
    auth,
    CSRF_experimental
    // @ts-ignore
} = NextAuth(authOptions)

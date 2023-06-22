// import { v4 as uuid } from "uuid";
// import GitHub from 'next-auth/providers/github'
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

const backendURL = process.env.NEXTAUTH_URL

export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                name: { label: "Username", type: "text" },
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password", placeholder: "Password defaults 123456"},
            },
            async authorize(credentials) {
                const credentialDetails = {
                    email: credentials.email,
                    password: credentials.password,
                    name: credentials.name,
                };
                const resp = await fetch(backendURL+"/api/auth/login", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentialDetails),
                });
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
                // token.user_type = user.userType;
                // token.accessToken = user.token;
            }

            return token;
        },
        // @ts-ignore
        session: ({ session, token, user }) => {
            if (token) {
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.id = token.id;
                // session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },
};

export const {
    handlers: { GET, POST },
    auth,
    CSRF_experimental
    // @ts-ignore
} = NextAuth(authOptions)

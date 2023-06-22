import { v4 as uuid } from "uuid";
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental
  // @ts-ignore
} = NextAuth({
  // @ts-ignore
  providers: [
    GitHub
  ],
  callbacks: {
    // @ts-ignore
    jwt: async ({ token, profile }) => {
      profile.id = 1;
      profile.name = 'Open Brain';
      profile.email = 'openbrain@gmail.com';
      profile.image = '/public/favicon.ico';
      token = localStorage.getItem('optoken')
      if(token == ""){
        const mytoken =  uuid()
        localStorage.setItem('optoken', mytoken)
        token = mytoken
      }
      if (profile?.id) {
        token.id = profile.id
        token.image = profile.picture
      }
      return token;
    },
    // @TODO
    authorized() {
      // return true;
      return {
        id: 1,
        name: 'Open Brain',
        email: 'openbrain@gmail.com',
        image: '/public/favicon.ico',
      };
      // if(request.user.id === auth.user.id) {
      // }
    }
    // authorized() {
    //   return true // If there is a token, the user is authenticated
    // }
  },
  pages: {
    signIn: '/sign-in',
  }
})

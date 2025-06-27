import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'User' | 'Admin' | 'Vendor';
    };
  }

  interface User {
    role: 'User' | 'Admin' | 'Vendor';
  }

  interface JWT {
    role: string;
  }
}

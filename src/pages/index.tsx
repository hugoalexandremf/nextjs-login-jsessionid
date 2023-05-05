import React from 'react';
import Login from '../components/Login';
import { useSession, signOut } from 'next-auth/react';
import fetchWS from '@/components/Utils';

export default function Home() {
  async function testFetch() {
    const response = await fetchWS('/api/hello');
    if (response.httpResponseStatus === 200) {
    } else {
    }
  }

  const { data: session, status } = useSession();
  console.log('index - sessionStatus:', status, session);
  if (status === 'authenticated') {
    console.log('user is authenticated:', session);
    return (
      <>
        <p>Signed in as {session.user.name}</p>
        <button onClick={testFetch}>Test fetch</button>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <Login />;
}

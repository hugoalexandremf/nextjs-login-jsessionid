import React from 'react';
import Login from '../components/Login';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  function testFetch() {
    
  }

  const { data: session, status } = useSession();
  console.log('index - sessionStatus:', status, session);
  if (status === 'authenticated') {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <Login />;
}

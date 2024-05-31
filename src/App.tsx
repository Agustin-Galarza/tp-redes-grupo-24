//import { useEffect, useState } from "react";
//import type { Schema } from "../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

//const client = generateClient<Schema>();

function App() {
  return (
    <Authenticator>
      {({ signOut, user}) => (
        <main>
          <h1>My APP - {user?.signInDetails?.loginId ?? "Anonymous"}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;

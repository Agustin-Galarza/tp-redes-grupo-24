import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient, user: undefined!, signOut: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

//const existingConfig = Amplify.getConfig();
//Amplify.configure({
//...existingConfig,
//API: {
//REST: outputs.custom.API,
//},
//});

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Authenticator>
          {({ signOut, user }) => (
            <RouterProvider router={router} context={{ user, signOut }} />
          )}
        </Authenticator>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

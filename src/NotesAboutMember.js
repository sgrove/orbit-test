/* NotesAboutMember.js */
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay/hooks";
import { auth } from "./Config";
import {
  ErrorFallback,
  stringifyRelayData,
  LocationNote,
  updateFormVariables,
} from "./utils";
import graphql from "babel-plugin-relay/macro";

const NOTES_ABOUT_MEMBER_QUERY = graphql`
  query NotesAboutMember_NotesAboutMemberQuery($apiKey: String!) {
    orbit(auths: { orbit: { apiKey: $apiKey } }) {
      makeRestCall {
        get(path: "/api/v1/464/members/385020/notes") {
          jsonBody
        }
      }
    }
  }
`;

export function NotesAboutMemberQuery(props) {
  const data = useLazyLoadQuery(NOTES_ABOUT_MEMBER_QUERY, props, {
    // Try to render from the store if we have some data available, but also refresh from the network
    fetchPolicy: "store-and-network",
    // Refetch the query if we've logged in/out of any service
    fetchKey: auth.accessToken()?.accessToken,
  });

  const dataEl = data ? (
    <div className="data-box">
      <h3>
        Data for NotesAboutMember <LocationNote />
      </h3>
      <pre>{stringifyRelayData(data)}</pre>
    </div>
  ) : null;

  return <div>{dataEl}</div>;
}

export default function NotesAboutMemberQueryForm(props) {
  const [queryVariables, setQueryVariables] = React.useState({ ...props });
  const [formVariables, setFormVariables] = React.useState({});
  const [hasError, setHasError] = React.useState(false);

  const formEl = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setQueryVariables({ ...formVariables });
      }}
    >
      <label htmlFor="apiKey">apiKey</label>
      <input
        id="apiKey"
        type="text"
        onChange={updateFormVariables(
          setFormVariables,
          ["apiKey"],
          (value) => value
        )}
      />
      <input type="submit" />
    </form>
  );

  /** If there's an error in the query component (Missing authentication, missing variable, CORS error, etc.)
      we'll let the ErrorBoundary handle the 'try again' action */
  const actionButtonEl = hasError ? null : (
    <button onClick={() => setQueryVariables({ ...formVariables })}>
      Run NotesAboutMemberQuery
    </button>
  );

  return (
    <div>
      <h3>NotesAboutMember</h3>
      {formEl}
      {actionButtonEl}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
          console.log("Reset queryVariables to trigger query run");
          setHasError(false);
          setQueryVariables({ ...props, ...formVariables });
        }}
        onError={(err) => {
          setHasError(true);
          console.log("Error detected:", err);
        }}
      >
        <Suspense fallback={"Loading NotesAboutMemberQuery..."}>
          <NotesAboutMemberQuery {...queryVariables} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

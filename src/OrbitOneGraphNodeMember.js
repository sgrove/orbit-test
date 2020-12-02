/* OrbitOneGraphNodeMember.js */
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
import { createPaginationContainer } from "react-relay";

export function PaginatedOrbitMemberPosts(props) {
  const { relay, orbitMemberForPaginatedPosts } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const loadMoreCount = 2;

  return (
    <div>
      <div className="data-box">
        <pre>{stringifyRelayData(orbitMemberForPaginatedPosts?.posts)}</pre>
      </div>
      <button
        className={isLoading ? "loading" : null}
        disabled={!relay.hasMore()}
        onClick={() => {
          if (!relay.isLoading()) {
            setIsLoading(true);
            relay.loadMore(loadMoreCount, (results) => {
              console.log("Loaded more posts: ", results);
              setIsLoading(false);
            });
          }
        }}
      >
        {isLoading
          ? "Loading more posts..."
          : relay.hasMore()
          ? `Fetch ${loadMoreCount} more posts`
          : "All posts have been fetched"}
      </button>
    </div>
  );
}

export const PaginatedOrbitMemberPostsContainer = createPaginationContainer(
  PaginatedOrbitMemberPosts,
  {
    orbitMemberForPaginatedPosts: graphql`
      fragment OrbitOneGraphNodeMember_orbitMemberForPaginatedPosts on OrbitMember
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        id
        posts(first: $count, after: $cursor)
          @connection(
            key: "OrbitOneGraphNodeMember_orbitMemberForPaginatedPosts_posts"
          ) {
          edges {
            node {
              id
              oneGraphId
              createdAt
              updatedAt
              description
              image
              url
              publishedAt
              title
            }
          }
        }
        oneGraphId
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props?.orbitMemberForPaginatedPosts?.posts;
    },
    getVariables(props, pagination, fragmentVariables) {
      const { count, cursor } = pagination;
      return {
        ...fragmentVariables,
        count: count,
        cursor: cursor,
        oneGraphId: props?.orbitMemberForPaginatedPosts?.oneGraphId,
      };
    },
    query: graphql`
      query OrbitOneGraphNodeMember_PaginatedOrbitMemberPostsContainerQuery(
        $oneGraphId: ID!
        $count: Int = 10
        $cursor: String
      ) {
        oneGraphNode(oneGraphId: $oneGraphId) {
          oneGraphId
          ...OrbitOneGraphNodeMember_orbitMemberForPaginatedPosts
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

const ORBIT_ONE_GRAPH_NODE_MEMBER_QUERY = graphql`
  query OrbitOneGraphNodeMemberQuery($apiKey: String!) {
    oneGraphNode(
      auths: { orbit: { apiKey: $apiKey } }
      oneGraphId: "MTpvcmJpdDpNVHBQY21KcGRFMWxiV0psY2pvME5qUTZNemcxTURBMw"
    ) {
      ... on OrbitMember {
        name
        id
        posts {
          edges {
            node {
              id
              oneGraphId
              createdAt
              updatedAt
              description
              image
              url
              publishedAt
              title
            }
          }
        }
      }
    }
  }
`;

export function OrbitOneGraphNodeMemberQuery(props) {
  const data = useLazyLoadQuery(ORBIT_ONE_GRAPH_NODE_MEMBER_QUERY, props, {
    // Try to render from the store if we have some data available, but also refresh from the network
    fetchPolicy: "store-and-network",
    // Refetch the query if we've logged in/out of any service
    fetchKey: auth.accessToken()?.accessToken,
  });

  const dataEl = data ? (
    <div className="data-box">
      <h3>
        Data for OrbitOneGraphNodeMember <LocationNote />
      </h3>
      <pre>{stringifyRelayData(data)}</pre>
    </div>
  ) : null;

  return <div>{dataEl}</div>;
}

export default function OrbitOneGraphNodeMemberQueryForm(props) {
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
      Run OrbitOneGraphNodeMemberQuery
    </button>
  );

  return (
    <div>
      <h3>OrbitOneGraphNodeMember</h3>
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
        <Suspense fallback={"Loading OrbitOneGraphNodeMemberQuery..."}>
          <OrbitOneGraphNodeMemberQuery {...queryVariables} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

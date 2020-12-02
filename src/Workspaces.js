/* Workspaces.js */
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
import Activity from "./Activity";
import Member from "./Member";
import Post from "./Post";
import Activity from "./Activity";

export function PaginatedWorkspacesActivities(props) {
  const { relay, workspacesForPaginatedActivities } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const activityUses = workspacesForPaginatedActivities?.activities?.edges?.map(
    (item, idx) => (
      <Activity key={item?.activity?.id || idx} activity={item?.activity} />
    )
  );

  const loadMoreCount = 2;

  return (
    <div>
      <div className="data-box">
        <pre>
          {stringifyRelayData(workspacesForPaginatedActivities?.activities)}
        </pre>
        <h4>
          ActivityUses <LocationNote />
        </h4>
        {activityUses}
      </div>
      <button
        className={isLoading ? "loading" : null}
        disabled={!relay.hasMore()}
        onClick={() => {
          if (!relay.isLoading()) {
            setIsLoading(true);
            relay.loadMore(loadMoreCount, (results) => {
              console.log("Loaded more activities: ", results);
              setIsLoading(false);
            });
          }
        }}
      >
        {isLoading
          ? "Loading more activities..."
          : relay.hasMore()
          ? `Fetch ${loadMoreCount} more activities`
          : "All activities have been fetched"}
      </button>
    </div>
  );
}

export const PaginatedWorkspacesActivitiesContainer = createPaginationContainer(
  PaginatedWorkspacesActivities,
  {
    workspacesForPaginatedActivities: graphql`
      fragment Workspaces_workspacesForPaginatedActivities on OrbitWorkspace
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        id
        activities(first: $count, after: $cursor)
          @connection(
            key: "Workspaces_workspacesForPaginatedActivities_activities"
          ) {
          edges {
            activity: node {
              __typename
              ...Activity_fragment
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
      return props?.workspacesForPaginatedActivities?.activities;
    },
    getVariables(props, pagination, fragmentVariables) {
      const { count, cursor } = pagination;
      return {
        ...fragmentVariables,
        count: count,
        cursor: cursor,
        oneGraphId: props?.workspacesForPaginatedActivities?.oneGraphId,
      };
    },
    query: graphql`
      query Workspaces_PaginatedWorkspacesActivitiesContainerQuery(
        $oneGraphId: ID!
        $count: Int = 10
        $cursor: String
      ) {
        oneGraphNode(oneGraphId: $oneGraphId) {
          oneGraphId
          ...Workspaces_workspacesForPaginatedActivities
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

const WORKSPACES_QUERY = graphql`
  query WorkspacesQuery($apiKey: String!) {
    orbit(auths: { orbit: { apiKey: $apiKey } }) {
      workspaces(first: 1) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          workspace: node {
            name
            oneGraphId
            slug
            createdAt
            updatedAt
            id
            members(first: 2) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                member: node {
                  ...Member_fragment
                }
              }
            }
            posts(first: 1) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                post: node {
                  ...Post_fragment
                }
              }
            }
            activity(id: "4050778") {
              ...Activity_fragment
            }
            ...Workspaces_workspacesForPaginatedActivities @arguments
          }
        }
      }
    }
  }
`;

export function WorkspacesQuery(props) {
  const data = useLazyLoadQuery(WORKSPACES_QUERY, props, {
    // Try to render from the store if we have some data available, but also refresh from the network
    fetchPolicy: "store-and-network",
    // Refetch the query if we've logged in/out of any service
    fetchKey: auth.accessToken()?.accessToken,
  });

  const dataEl = data ? (
    <div className="data-box">
      <h3>
        Data for Workspaces <LocationNote />
      </h3>
      <pre>{stringifyRelayData(data)}</pre>
    </div>
  ) : null;

  const memberUses = data?.orbit?.workspaces?.edges?.map((item, idx) =>
    item?.workspace?.members?.edges?.map((item, idx) => (
      <Member key={item?.member?.id || idx} member={item?.member} />
    ))
  );
  const postUses = data?.orbit?.workspaces?.edges?.map((item, idx) =>
    item?.workspace?.posts?.edges?.map((item, idx) => (
      <Post key={item?.post?.id || idx} post={item?.post} />
    ))
  );
  const activityUses = data?.orbit?.workspaces?.edges?.map((item, idx) => (
    <Activity
      key={item?.workspace?.activity?.id || idx}
      activity={item?.workspace?.activity}
    />
  ));
  const paginatedWorkspacesActivitiesUses = data?.orbit?.workspaces?.edges?.map(
    (item, idx) => (
      <PaginatedWorkspacesActivitiesContainer
        key={item?.workspace?.id || idx}
        workspacesForPaginatedActivities={item?.workspace}
      />
    )
  );

  return (
    <div>
      {dataEl}
      <h4>
        MemberUses <LocationNote />
      </h4>
      {memberUses}
      <h4>
        PostUses <LocationNote />
      </h4>
      {postUses}
      <h4>
        ActivityUses <LocationNote />
      </h4>
      {activityUses}
      <h4>
        PaginatedWorkspacesActivitiesUses <LocationNote />
      </h4>
      {paginatedWorkspacesActivitiesUses}
    </div>
  );
}

export default function WorkspacesQueryForm(props) {
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
      Run WorkspacesQuery
    </button>
  );

  return (
    <div>
      <h3>Workspaces</h3>
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
        <Suspense fallback={"Loading WorkspacesQuery..."}>
          <WorkspacesQuery {...queryVariables} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

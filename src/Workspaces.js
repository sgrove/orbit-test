/* Workspaces.js */
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay/hooks";
import { auth } from "./Config";
import { ErrorFallback, LocationNote, updateFormVariables } from "./utils";
import graphql from "babel-plugin-relay/macro";
import { createPaginationContainer } from "react-relay";
import Activity from "./Activity";
import Member from "./Member";
import Post from "./Post";

export function PaginatedOrbitWorkspaces(props) {
  const { relay, orbitForPaginatedWorkspaces } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const workspacesForPaginatedMembersUses = orbitForPaginatedWorkspaces?.workspaces?.edges?.map(
    (item, idx) => (
      <PaginatedWorkspacesMembersContainer
        key={item?.workspace?.id || idx}
        workspacesForPaginatedMembers={item?.workspace}
      />
    )
  );
  const workspacesForPaginatedPostsUses = orbitForPaginatedWorkspaces?.workspaces?.edges?.map(
    (item, idx) => (
      <PaginatedWorkspacesPostsContainer
        key={item?.workspace?.id || idx}
        workspacesForPaginatedPosts={item?.workspace}
      />
    )
  );
  const activityUses = orbitForPaginatedWorkspaces?.workspaces?.edges?.map(
    (item, idx) => (
      <Activity
        key={item?.workspace?.activity?.id || idx}
        activity={item?.workspace?.activity}
      />
    )
  );
  const workspacesForPaginatedActivitiesUses = orbitForPaginatedWorkspaces?.workspaces?.edges?.map(
    (item, idx) => (
      <PaginatedWorkspacesActivitiesContainer
        key={item?.workspace?.id || idx}
        workspacesForPaginatedActivities={item?.workspace}
      />
    )
  );

  const loadMoreCount = 2;

  return (
    <div>
      <div className="data-box">
        <pre>{stringifyRelayData(orbitForPaginatedWorkspaces?.workspaces)}</pre>
        <h4>
          WorkspacesForPaginatedMembersUses <LocationNote />
        </h4>
        {workspacesForPaginatedMembersUses}
        <h4>
          WorkspacesForPaginatedPostsUses <LocationNote />
        </h4>
        {workspacesForPaginatedPostsUses}
        <h4>
          ActivityUses <LocationNote />
        </h4>
        {activityUses}
        <h4>
          WorkspacesForPaginatedActivitiesUses <LocationNote />
        </h4>
        {workspacesForPaginatedActivitiesUses}
      </div>
      <button
        className={isLoading ? "loading" : null}
        disabled={!relay.hasMore()}
        onClick={() => {
          if (!relay.isLoading()) {
            setIsLoading(true);
            relay.loadMore(loadMoreCount, (results) => {
              console.log("Loaded more workspaces: ", results);
              setIsLoading(false);
            });
          }
        }}
      >
        {isLoading
          ? "Loading more workspaces..."
          : relay.hasMore()
          ? `Fetch ${loadMoreCount} more workspaces`
          : "All workspaces have been fetched"}
      </button>
    </div>
  );
}

export const PaginatedOrbitWorkspacesContainer = createPaginationContainer(
  PaginatedOrbitWorkspaces,
  {
    orbitForPaginatedWorkspaces: graphql`
      fragment Workspaces_orbitForPaginatedWorkspaces on OrbitQuery
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        workspaces(first: $count, after: $cursor)
          @connection(
            key: "Workspaces_orbitForPaginatedWorkspaces_workspaces"
          ) {
          edges {
            workspace: node {
              name
              oneGraphId
              slug
              createdAt
              updatedAt
              id
              ...Workspaces_workspacesForPaginatedMembers
                @arguments(count: $count, cursor: $cursor)
              ...Workspaces_workspacesForPaginatedPosts
                @arguments(count: $count, cursor: $cursor)
              activity(id: "4050778") {
                ...Activity_fragment
              }
              ...Workspaces_workspacesForPaginatedActivities
                @arguments(count: $count, cursor: $cursor)
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props?.orbitForPaginatedWorkspaces?.workspaces;
    },
    getVariables(props, pagination, fragmentVariables) {
      const { count, cursor } = pagination;
      return { ...fragmentVariables, count: count, cursor: cursor };
    },
    query: graphql`
      query Workspaces_PaginatedOrbitWorkspacesContainerQuery(
        $apiKey: String!
        $count: Int = 10
        $cursor: String
      ) {
        orbit(auths: { orbit: { apiKey: $apiKey } }) {
          ...Workspaces_orbitForPaginatedWorkspaces
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export function PaginatedWorkspacesMembers(props) {
  const { relay, workspacesForPaginatedMembers } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const memberUses = workspacesForPaginatedMembers?.members?.edges?.map(
    (item, idx) => (
      <Member key={item?.member?.id || idx} member={item?.member} />
    )
  );

  const loadMoreCount = 2;

  return (
    <div>
      <div className="data-box">
        <pre>{stringifyRelayData(workspacesForPaginatedMembers?.members)}</pre>
        <h4>
          MemberUses <LocationNote />
        </h4>
        {memberUses}
      </div>
      <button
        className={isLoading ? "loading" : null}
        disabled={!relay.hasMore()}
        onClick={() => {
          if (!relay.isLoading()) {
            setIsLoading(true);
            relay.loadMore(loadMoreCount, (results) => {
              console.log("Loaded more members: ", results);
              setIsLoading(false);
            });
          }
        }}
      >
        {isLoading
          ? "Loading more members..."
          : relay.hasMore()
          ? `Fetch ${loadMoreCount} more members`
          : "All members have been fetched"}
      </button>
    </div>
  );
}

export const PaginatedWorkspacesMembersContainer = createPaginationContainer(
  PaginatedWorkspacesMembers,
  {
    workspacesForPaginatedMembers: graphql`
      fragment Workspaces_workspacesForPaginatedMembers on OrbitWorkspace
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        id
        members(first: $count, after: $cursor)
          @connection(key: "Workspaces_workspacesForPaginatedMembers_members") {
          edges {
            member: node {
              ...Member_fragment
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
      return props?.workspacesForPaginatedMembers?.members;
    },
    getVariables(props, pagination, fragmentVariables) {
      const { count, cursor } = pagination;
      return {
        ...fragmentVariables,
        count: count,
        cursor: cursor,
        oneGraphId: props?.workspacesForPaginatedMembers?.oneGraphId,
      };
    },
    query: graphql`
      query Workspaces_PaginatedWorkspacesMembersContainerQuery(
        $oneGraphId: ID!
        $count: Int = 10
        $cursor: String
      ) {
        oneGraphNode(oneGraphId: $oneGraphId) {
          oneGraphId
          ...Workspaces_workspacesForPaginatedMembers
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export function PaginatedWorkspacesPosts(props) {
  const { relay, workspacesForPaginatedPosts } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const postUses = workspacesForPaginatedPosts?.posts?.edges?.map(
    (item, idx) => <Post key={item?.post?.id || idx} post={item?.post} />
  );

  const loadMoreCount = 2;

  return (
    <div>
      <div className="data-box">
        <pre>{stringifyRelayData(workspacesForPaginatedPosts?.posts)}</pre>
        <h4>
          PostUses <LocationNote />
        </h4>
        {postUses}
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

export const PaginatedWorkspacesPostsContainer = createPaginationContainer(
  PaginatedWorkspacesPosts,
  {
    workspacesForPaginatedPosts: graphql`
      fragment Workspaces_workspacesForPaginatedPosts on OrbitWorkspace
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        id
        posts(first: $count, after: $cursor)
          @connection(key: "Workspaces_workspacesForPaginatedPosts_posts") {
          edges {
            post: node {
              ...Post_fragment
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
      return props?.workspacesForPaginatedPosts?.posts;
    },
    getVariables(props, pagination, fragmentVariables) {
      const { count, cursor } = pagination;
      return {
        ...fragmentVariables,
        count: count,
        cursor: cursor,
        oneGraphId: props?.workspacesForPaginatedPosts?.oneGraphId,
      };
    },
    query: graphql`
      query Workspaces_PaginatedWorkspacesPostsContainerQuery(
        $oneGraphId: ID!
        $count: Int = 10
        $cursor: String
      ) {
        oneGraphNode(oneGraphId: $oneGraphId) {
          oneGraphId
          ...Workspaces_workspacesForPaginatedPosts
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

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
      ...Workspaces_orbitForPaginatedWorkspaces @arguments
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

  console.log("WORKSPACES_QUERY data", data);
  const paginatedOrbitWorkspacesUses = (
    <PaginatedOrbitWorkspacesContainer
      orbitForPaginatedWorkspaces={data?.orbit}
    />
  );

  return (
    <div>
      <h4>
        PaginatedOrbitWorkspacesUses <LocationNote />
      </h4>
      {paginatedOrbitWorkspacesUses}
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

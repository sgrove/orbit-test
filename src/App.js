/* App.js */
import React from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import RelayEnvironment from "./RelayEnvironment";
import Header from "./Header";
import WorkspacesQuery from "./Workspaces";
import OrbitOneGraphNodeWorkspaceQuery from "./OrbitOneGraphNodeWorkspace";
import OrbitOneGraphNodeMemberQuery from "./OrbitOneGraphNodeMember";
import OrbitOneGraphNodeNoteQuery from "./OrbitOneGraphNodeNote";
import OrbitOneGraphNodePostQuery from "./OrbitOneGraphNodePost";
import ActivityTypesQuery from "./ActivityTypes";
import RestWorkspacesQuery from "./RestWorkspaces";
import WorkspaceQuery from "./Workspace";
import MembersQuery from "./Members";
import MemberQuery from "./Member";
import NotesAboutMemberQuery from "./NotesAboutMember";
import PostsFromMemberQuery from "./PostsFromMember";
import ActivitiesQuery from "./Activities";
import ActivityQuery from "./Activity";

function App() {
  return (
    <>
      <Header />
      <section className="query">
        <WorkspacesQuery apiKey={null} />
      </section>
      <section className="query">
        <OrbitOneGraphNodeWorkspaceQuery apiKey={null} />
      </section>
      <section className="query">
        <OrbitOneGraphNodeMemberQuery apiKey={null} />
      </section>
      <section className="query">
        <OrbitOneGraphNodeNoteQuery apiKey={null} />
      </section>
      <section className="query">
        <OrbitOneGraphNodePostQuery apiKey={null} />
      </section>
      <section className="query">
        <ActivityTypesQuery apiKey={null} />
      </section>
      <section className="query">
        <RestWorkspacesQuery apiKey={null} />
      </section>
      <section className="query">
        <WorkspaceQuery apiKey={null} />
      </section>
      <section className="query">
        <MembersQuery apiKey={null} />
      </section>
      <section className="query">
        <MemberQuery apiKey={null} />
      </section>
      <section className="query">
        <NotesAboutMemberQuery apiKey={null} />
      </section>
      <section className="query">
        <PostsFromMemberQuery apiKey={null} />
      </section>
      <section className="query">
        <ActivitiesQuery apiKey={null} />
      </section>
      <section className="query">
        <ActivityQuery apiKey={null} />
      </section>
    </>
  );
}

// The above component needs to know how to access the Relay environment, and we
// need to specify a fallback in case it suspends:
// - <RelayEnvironmentProvider> tells child components how to talk to the current
//   Relay Environment instance
// - <Suspense> specifies a fallback in case a child suspends.
function AppRoot(props) {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <App />
    </RelayEnvironmentProvider>
  );
}

export default AppRoot;

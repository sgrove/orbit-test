/* Activity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";
import PullRequestActivity from "./PullRequestActivity";
import IssueActivity from "./IssueActivity";
import IssueCommentActivity from "./IssueCommentActivity";
import CustomActivity from "./CustomActivity";

export default function Activity(props) {
  const data = useFragment(
    graphql`
      fragment Activity_fragment on OrbitActivity {
        __typename
        id
        key
        action
        occurredAt
        updatedAt
        ...PullRequestActivity_fragment
        ...IssueActivity_fragment
        ...IssueCommentActivity_fragment
        ...CustomActivity_fragment
      }
    `,
    props.activity
  );

  const pullRequestActivityUses = <PullRequestActivity activity={data} />;
  const issueActivityUses = <IssueActivity activity={data} />;
  const issueCommentActivityUses = <IssueCommentActivity activity={data} />;
  const customActivityUses = <CustomActivity activity={data} />;

  return (
    <>
      <div className="data-box">
        <h3>
          Data for Activity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
        <h4>
          PullRequestActivityUses <LocationNote />
        </h4>
        {pullRequestActivityUses}
        <h4>
          IssueActivityUses <LocationNote />
        </h4>
        {issueActivityUses}
        <h4>
          IssueCommentActivityUses <LocationNote />
        </h4>
        {issueCommentActivityUses}
        <h4>
          CustomActivityUses <LocationNote />
        </h4>
        {customActivityUses}
      </div>
    </>
  );
}

/* Activity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

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
        ... on OrbitPullRequestActivity {
          gitHubTitle
          gitHubMerged
          gitHubMergedAt
        }
        ... on OrbitIssueActivity {
          gitHubTitle
        }
        ... on OrbitIssueCommentActivity {
          gitHubTitle
          gitHubHtmlUrl
          gitHubNumber
          gitHubCreatedAt
          gitHubId
          gitHubBody
          gitHubTitle
        }
        ... on OrbitCustomActivity {
          raw
        }
      }
    `,
    props.activity
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for Activity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

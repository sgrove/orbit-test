/* IssueCommentActivity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function IssueCommentActivity(props) {
  const data = useFragment(
    graphql`
      fragment IssueCommentActivity_fragment on OrbitIssueCommentActivity {
        gitHubTitle
        gitHubHtmlUrl
        gitHubNumber
        gitHubCreatedAt
        gitHubId
        gitHubBody
        gitHubTitle
      }
    `,
    props.activity
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for IssueCommentActivity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

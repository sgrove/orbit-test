/* PullRequestActivity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function PullRequestActivity(props) {
  const data = useFragment(
    graphql`
      fragment PullRequestActivity_fragment on OrbitPullRequestActivity {
        gitHubTitle
        gitHubMerged
        gitHubMergedAt
      }
    `,
    props.activity
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for PullRequestActivity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

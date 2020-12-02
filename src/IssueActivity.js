/* IssueActivity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function IssueActivity(props) {
  const data = useFragment(
    graphql`
      fragment IssueActivity_fragment on OrbitIssueActivity {
        gitHubTitle
      }
    `,
    props.activity
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for IssueActivity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

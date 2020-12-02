/* CustomActivity.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function CustomActivity(props) {
  const data = useFragment(
    graphql`
      fragment CustomActivity_fragment on OrbitCustomActivity {
        raw
      }
    `,
    props.activity
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for CustomActivity <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

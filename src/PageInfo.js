/* PageInfo.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function PageInfo(props) {
  const data = useFragment(
    graphql`
      fragment PageInfo_fragment on PageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    `,
    props.info
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for PageInfo <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

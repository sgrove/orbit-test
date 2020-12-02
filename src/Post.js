/* Post.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function Post(props) {
  const data = useFragment(
    graphql`
      fragment Post_fragment on OrbitPost {
        createdAt
        description
        image
        publishedAt
        title
        updatedAt
        url
        id
      }
    `,
    props.post
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for Post <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

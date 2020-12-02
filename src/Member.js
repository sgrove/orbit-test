/* Member.js */
import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { stringifyRelayData, LocationNote } from "./utils";

export default function Member(props) {
  const data = useFragment(
    graphql`
      fragment Member_fragment on OrbitMember {
        id
        oneGraphId
        bio
        birthday
        company
        location
        name
        pronouns
        shippingAddress
        slug
        tagsToAdd
        tagList
        tshirt
        teammate
        url
        github
        twitter
        email
        discourse
        discourseHostname
        linkedin
        devto
      }
    `,
    props.member
  );

  return (
    <>
      <div className="data-box">
        <h3>
          Data for Member <LocationNote />
        </h3>
        <pre>{stringifyRelayData(data)}</pre>
      </div>
    </>
  );
}

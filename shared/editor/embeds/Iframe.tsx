import * as React from "react";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

function Iframe({ matches, ...props }: Props) {
  // const { matches } = props.attrs;
  const source = matches[0];
  return <Frame {...props} src={source} title="Iframe" />;
}

// Iframe.ENABLED = [new RegExp("^https://veed.io/?(.*)$"),new RegExp("^https://.*clairvision.org/?(.*)$"), new RegExp("^https://.*youtube.com/(.*)$")];
// Iframe.URL_PATH_REGEX = /(.+)/;

export default Iframe;

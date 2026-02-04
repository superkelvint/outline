import * as React from "react";
import type { EmbedProps as Props } from ".";

function EmbedMP4({ matches }: Props) {
  const source = matches[0];
  return (
    <video width="750" height="500" controls preload="none">
      <source src={source} type="video/mp4" />
    </video>
  );
}

export default EmbedMP4;

import styled from "@emotion/styled";
import Headings from "@narative/gatsby-theme-novela/src/components/Headings/Headings";

console.log("Headings.h1")
console.log(Headings.h1)

const h1 = styled(Headings.h1)`
  word-wrap: break-word;
  word-break: break-all;
`;

const h2 = styled(Headings.h2)`
  word-wrap: break-word;
  word-break: break-all;
`;

const h3 = styled(Headings.h3)`
  word-wrap: break-word;
  word-break: break-all;
`;

const h4 = styled(Headings.h4)`
  word-wrap: break-word;
  word-break: break-all;
`;

const h5 = styled(Headings.h5)`
  word-wrap: break-word;
  word-break: break-all;
`;

const h6 = styled(Headings.h6)`
  word-wrap: break-word;
  word-break: break-all;
`;

export default {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
};

import { Disqus, CommentCount } from 'gatsby-plugin-disqus'

import React, { useState } from "react";

import Section from "@components/Section";

import styled from "@emotion/styled";
import mediaqueries from "@styles/media";

const Diqus: React.FC<{}> = ({
  title,
  url,
  id,
}) => {
  let disqusConfig = {
    url: url,
    identifier: id,
    title: title,
  }
  return (
    <Section narrow>
      <DisqusContainer >
        <Content>
        <CommentCount config={disqusConfig} placeholder={''} />
        <Disqus config={disqusConfig} />
        </Content>
      </DisqusContainer>
    </Section>
  )
};

export default Diqus;

const DisqusContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 64px 50px 55px;
  margin: 10px auto 100px;
  background: ${p => p.theme.colors.card};
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.05);
  z-index: 1;

  ${mediaqueries.tablet`
    padding: 50px 30px 0;
    text-align: center;
  `}

  ${mediaqueries.phablet`
    margin: -20px auto 80px;
  `}
`;

const Content = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 800px;

  ${mediaqueries.tablet`
    h3 {
      padding: 0 50px;
    }
  `}

  ${mediaqueries.phone`
    h3 {
      padding: 0 24px;
    }
  `}
`;

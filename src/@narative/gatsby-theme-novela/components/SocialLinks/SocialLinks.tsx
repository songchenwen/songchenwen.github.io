import React from 'react';
import styled from '@emotion/styled';
import mediaqueries from '@styles/media';

import MyIcons from '../../../../icons';
import RepoStatus from '@components/RepoStatus';
const Origin = require("@narative/gatsby-theme-novela/src/components/SocialLinks/SocialLinks");

const OriginSocialLinks = Origin.default

interface SocialLinksProps {
  links: {
    name: string;
    url: string;
  }[];
  fill: string;
}

const icons = {
  wechat: MyIcons.WeChat,
  weibo: MyIcons.Weibo,
};

const getHostname = url => {
  return new URL(url.toLowerCase()).hostname.replace('www.', '').split('.')[0];
};

const filterLinks = ({name}) => {
  return name == "github" || icons[name]
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  fill = '#73737D'
}) => {
  if (!links) return null;
  const extraLinks = links.filter(filterLinks)
  const originLinks = links.filter(({name}) => { return !filterLinks({name}) })

  return (
    <>
      {extraLinks.map(option => {
        const name = option.name || getHostname(option.url);
        if (name == "github") {
          return (<RepoStatus url={option.url} fill={fill} />)
        }
        const Icon = icons[name];
        if (!Icon) {
          return null;
        }
        return (
          <SocialIconContainer
            key={option.url}
            target="_blank"
            rel="noopener nofollow"
            data-a11y="false"
            aria-label={`Link to ${option.url}`}
            href={option.url}
          >
            <Icon fill={fill} />
            <Hidden>Link to ${option.url}</Hidden>
          </SocialIconContainer>
        );
      })}
      <OriginSocialLinks links={originLinks} />
    </>
  );
};

export default SocialLinks;

const SocialIconContainer = styled.a`
  position: relative;
  margin-left: 3.2rem;
  text-decoration: none;
  max-width: 16px;

  &:hover {
    svg {
      &:hover * {
        fill: ${p => p.theme.colors.primary};
      }
      * {
        transition: fill 0.25s var(--ease-in-out-quad);
      }
    }
  }

  &:first-of-type {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &[data-a11y='true']:focus::after {
    content: '';
    position: absolute;
    left: -50%;
    top: -20%;
    width: 200%;
    height: 160%;
    border: 2px solid ${p => p.theme.colors.accent};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 5px;
  }

  ${mediaqueries.tablet`
    margin: 0 2.2rem;
  `};
`;

const Hidden = styled.span`
  width: 0px;
  height: 0px;
  visibility: hidden;
  opacity: 0;
  overflow: hidden;
  display: inline-block;
`;

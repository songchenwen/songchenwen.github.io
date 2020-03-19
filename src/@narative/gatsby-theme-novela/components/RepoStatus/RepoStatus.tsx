import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import mediaqueries from '@styles/media';
import { useStaticQuery, graphql } from 'gatsby';

import Icons from '@icons';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

interface RepoStatusProps {
  url: string;
  fill: string;
}

const Github = Icons.Github

const failingColor = "#ff0000"
const buildingColor = "#ffff00"
const updateColor = "#0000ff"

const buildTimeQuery = graphql`
query BuildTimeQuery {
  site {
    buildTime
  }
}
`;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const RepoStatus: React.FC<RepoStatusProps> = ({ url, fill = '#73737D'}) => {
  var repo = splitUrl(url)
  if (!repo) {
    return (
      <RepoStatusContent rel="noopener nofollow" key={url} href={url} target="_blank" title="Github">
         <Github fill={fill} />
      </RepoStatusContent>
    );
  }
  const buildTimeData = useStaticQuery(buildTimeQuery)
  const buildTime = Date.parse(buildTimeData.site.buildTime)
  const githubUserURL = "https://github.com/" + repo.user;
  const buildStatusURL = "https://api.github.com/repos/" + repo.user + "/" + repo.repo + "/actions/workflows/build.yml/runs?per_page=1"
  const pulseAnimation = "pulse 2s ease-in-out infinite"
  const [iconColor, setIconColor] = useState(fill)
  const [linkTitle, setLinkTitle] = useState(repo.user)
  const [animationStyle, setAnimation] = useState("")

  const updateStatus = () => {
    fetch(buildStatusURL)
    .then(response => response.json()) // parse JSON from request
    .then(resultData => {
      if (resultData.workflow_runs) {
        const status = resultData.workflow_runs[0].status
        const conclusion = resultData.workflow_runs[0].conclusion
        const createdAt = Date.parse(resultData.workflow_runs[0].created_at)
        const updatedAt = resultData.workflow_runs[0].updated_at
      
        if (status == "completed"){
          var title = "Build " + conclusion + " since " + timeAgo.format(Date.parse(updatedAt))
          if (conclusion == "success") {
            if (buildTime < createdAt) {
              setIconColor(updateColor)
              setAnimation(pulseAnimation)
              title = "Update available since " + timeAgo.format(Date.parse(updatedAt))
            } else {
              setIconColor(fill)
              setAnimation("")
            }
          } else {
            setIconColor(failingColor)
            setAnimation(pulseAnimation)
          }
          setLinkTitle(title)
        } else {
          setLinkTitle("Build " + status + " since " + timeAgo.format(Date.parse(updatedAt)))
          setIconColor(buildingColor)
          setAnimation(pulseAnimation)
        }
      }
    })
  }
  useInterval(updateStatus, 15 * 1000)
  useEffect(updateStatus, [])
  return (
    <RepoStatusContent rel="noopener nofollow" key={githubUserURL} target="_blank" href={githubUserURL} title={linkTitle} style={{animation: animationStyle}}>
       <Github fill={iconColor} />
    </RepoStatusContent>
  );
};

const splitUrl = (url) => {
  url = url.toLowerCase()
  if (!url.startsWith("https://github.com/")){
    return null
  }
  url = url.replace("https://github.com/", "")
  var items = url.split("/");
  if (items.length != 2) {
    return null
  }
  if (items[0].length == 0 || items[1].length == 0){
    return null
  }
  return {"user": items[0], "repo": items[1]}
};

export default RepoStatus;

const RepoStatusContent = styled.a`
  position: relative;
  margin-left: 3.2rem;
  text-decoration: none;
  max-width: 16px;

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

  @keyframes pulse {
    0% {
      opacity: 1;
    }
  
    70% {
      opacity: 0.5;
    }
  
    100% {
      opacity: 1;
    }
  }

  ${mediaqueries.tablet`
    margin: 0 2.2rem;
  `};
`;

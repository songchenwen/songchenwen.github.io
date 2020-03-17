import React from "react";

import Layout from "@narative/gatsby-theme-novela/src/components/Layout";
import Section from "@narative/gatsby-theme-novela/src/components/Section";
import Headings from "@narative/gatsby-theme-novela/src/components/Headings";

function WeChat() {
  return (
    <Layout>
      <Section>
        <div style={{ marginTop: "100px", "text-align": "center" }}>
          <Headings.h1>扫码关注我的微信公众号</Headings.h1>
          <img src="/img/wechat.jpg" alt="QR Code" style={{ paddingBottom: "300px", marginTop: "100px" }}/>
        </div>
      </Section>
    </Layout>
  );
}

export default WeChat;

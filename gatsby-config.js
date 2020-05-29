require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `宋辰文`,
    name: `宋辰文`,
    siteUrl: `https://songchenwen.com`,
    description: `技术, 时事, 潜水, 滑雪`,
    hero: {
      heading: `宋辰文的博客`,
      maxWidth: 652,
    },
    social: [
      {
        name: `github`,
        url: `https://github.com/songchenwen/songchenwen.github.io`,
      },
      {
        name: `wechat`,
        url: `https://mp.weixin.qq.com/s?__biz=MzAxNTI3MTUwMA==&mid=2247483701&idx=2&sn=34613cbb3252ac5eb6c31724f3109b59`,
      },
      {
        name: `weibo`,
        url: `https://weibo.com/songchenwen`,
      },
      {
        name: `twitter`,
        url: `https://twitter.com/songchenwen`,
      },
      {
        name: `stackoverflow`,
        url: `https://stackoverflow.com/users/2210682/songchenwen`,
      },
    ],
  },
  plugins: [
    `gatsby-plugin-advanced-sitemap`,
    'gatsby-plugin-meta-redirect',
    {
      resolve: 'gatsby-source-contentful',
      options: {
        forceFullSync: true,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
      },
    },
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: false,
        sources: {
          local: false,
          contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `garyblog`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-161230431-1",
      },
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'zh'
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `宋辰文`,
        short_name: `宋辰文`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.svg`,
        theme_color_in_head: false,
      },
    },
    "gatsby-plugin-remove-serviceworker",
  ],
};

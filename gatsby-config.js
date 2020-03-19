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
        url: `/wechat/`,
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
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
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
    "gatsby-plugin-offline",
  ],
};

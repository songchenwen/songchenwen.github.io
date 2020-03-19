import React from 'react';
import Layout from "@narative/gatsby-theme-novela/src/components/Layout/Layout"
import Disqus from "../Disqus"

export default ( {children} ) => {
    if (children[0].type.name == "ArticleSEO") {
        return (
            <Layout>
                {children}
                <Disqus />
            </Layout>
        );
    }
    return (
        <Layout>
            {children}
        </Layout>
    );
}

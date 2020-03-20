import React from 'react';
import Layout from "@narative/gatsby-theme-novela/src/components/Layout/Layout"
import Disqus from "../Disqus"

export default ( {children} ) => {
    var shouldAddDisqus = false
    if (children && children.forEach) {
        children.forEach((child) => {
            if (shouldAddDisqus){
                return
            }
            if (child.props && child.props.article){
                shouldAddDisqus = true
            }
        });
    }
    if (shouldAddDisqus) {
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

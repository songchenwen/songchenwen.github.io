const data = require("./data.json")

module.exports = async ({ actions }) => {
    const { createRedirect } = actions
    data.forEach((item) => {
        item.redirect_from.forEach((from) => {
            createRedirect({ fromPath: from, toPath: item.path, isPermanent: true })
        })
    })
}
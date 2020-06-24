module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300; // NextJS sometimes doesnt reflect changes. change to xxxms.
        return config;
    }
};
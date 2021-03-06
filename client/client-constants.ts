import * as path from "path";

/**
 * Root of BatchLabs(This is relative to where this file is when in the build folder)
 */
const root = path.join(__dirname, "../..");

const urls = {
    main: {
        dev: "http://localhost:3178/index.html",
        prod: `file://${__dirname}/../../build/index.html`,
    },
    splash: {
        dev: `file://${root}/client/splash-screen/splash-screen.html`,
        prod: `file://${root}/build/client/splash-screen/splash-screen.html`,
    },
    icon: __dirname + "/../assets/images/labs.ico",
};

export const Constants = {
    root,
    urls,
};

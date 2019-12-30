import mime from "mime-types";
import serveError from "./utils/serveError";
import serveFile from "./utils/serveFile";
import serveCachedPageSsr from "./utils/serveCachedPageSsr";

export const handler = async event => {
    const ts = new Date();
    try {
        if (mime.lookup(event.path)) {
            return serveFile(event);
        }

        console.log('pokrecemo serceCachedPageSsr', new Date() - ts);
        return serveCachedPageSsr(event, ts);
    } catch (e) {
        // An error occurred, serve the error.
        return serveError(e);
    }
};

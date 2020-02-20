import createHandler from "./apollo-server/createHandler";
let handler;

export default ({ cacheMaxAge = DEFAULT_CACHE_MAX_AGE } = {}) => ({
    type: "handler",
    name: "handler-files",
    canHandle({ args }) {
        const [event] = args;
        return !mime.lookup(event.path);
    },
    async handle({ context, args }) {
        const [event] = args;

        if (!handler) {
            handler = await createHandler(context);
        }

        try {
            const { key } = event.pathParameters;
            let buffer = await load(key);
            if (buffer) {
                const headers = { "Cache-Control": "public, max-age=" + cacheMaxAge };
                if (isUtf8(buffer)) {
                    buffer = zlib.gzipSync(buffer);
                    headers["Content-Encoding"] = "gzip";
                }

                return createResponse({
                    type: mime.lookup(event.path),
                    body: buffer.toString("base64"),
                    isBase64Encoded: true,
                    headers
                });
            }
        } catch {
            // Do nothing.
        }

        return createResponse({
            statusCode: 404,
            type: "text/plain",
            body: "Not found.",
            headers: {
                "Cache-Control": "public, max-age=" + cacheMaxAge
            }
        });
    }
});

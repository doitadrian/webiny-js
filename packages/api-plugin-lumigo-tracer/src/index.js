import lumigo from "@lumigo/tracer";

export default ({ token, enabled = true }) => ({
    name: "handler-wrapper-lumigo-tracer",
    type: "handler-wrapper",
    async wrap({ handler }) {
        if (!enabled) {
            return handler;
        }

        return lumigo({ token }).trace(handler);
    }
});

const S3 = require("aws-sdk/clients/s3");
const transformImage = require("./transformImage");
const optimizeImage = require("./optimizeImage");
const { getEnvironment, getObjectParams } = require("../../utils");
const { getImageKey } = require("./../utils");

module.exports.handler = async ({ body: { transformations, key } }) => {
    try {
        const env = getEnvironment();
        const s3 = new S3({ region: env.region });

        let optimizedImageObject;

        const params = {
            initial: getObjectParams(key),
            optimized: getObjectParams(getImageKey({ key })),
            optimizedTransformed: getObjectParams(getImageKey({ key, transformations }))
        };

        // 1. Get optimized image.
        try {
            optimizedImageObject = await s3.getObject(params.optimized).promise();
        } catch (e) {
            // If not found, try to create it by loading the initially uploaded image.
            optimizedImageObject = await s3.getObject(params.initial).promise();

            await s3
                .putObject({
                    ...params.optimized,
                    ContentType: optimizedImageObject.ContentType,
                    Body: await optimizeImage(
                        optimizedImageObject.Body,
                        optimizedImageObject.ContentType
                    )
                })
                .promise();

            optimizedImageObject = await s3.getObject(params.optimized).promise();
        }

        // 2. If no transformations requested, just exit.
        if (!transformations) {
            return { error: false, message: "" };
        }

        // 3. If transformations requested, apply them in save it into the bucket.
        await s3
            .putObject({
                ...params.optimizedTransformed,
                ContentType: optimizedImageObject.ContentType,
                Body: await transformImage(optimizedImageObject.Body, transformations)
            })
            .promise();

        return { error: false, message: "" };
    } catch (e) {
        return { error: true, message: e.message };
    }
};

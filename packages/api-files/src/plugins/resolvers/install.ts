import { ErrorResponse, Response } from "@webiny/api";

export const install = async (
    root: any,
    args: Record<string, any>,
    context: Record<string, any>
) => {
    // Start the download of initial Page Builder page / block images.
    const { FilesSettings } = context.models;

    try {
        const settings = await FilesSettings.load();
        if (await settings.data.installed) {
            return new ErrorResponse({
                code: "FILES_INSTALL_ABORTED",
                message: "File Manager is already installed."
            });
        }

        if (args.srcPrefix) {
            settings.data.srcPrefix = args.srcPrefix;
        }
        settings.data.installed = true;
        await settings.save();
        return new Response(true);
    } catch (e) {
        return new ErrorResponse({
            code: "FILES_INSTALL_ERROR",
            message: e.message
        });
    }
};

export const isInstalled = async (
    root: any,
    args: Record<string, any>,
    context: Record<string, any>
) => {
    const { FilesSettings } = context.models;
    const settings = await FilesSettings.load();
    return new Response(settings.data.installed);
};
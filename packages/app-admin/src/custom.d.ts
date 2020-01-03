declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
        alt?: string;
    }>;

    const src: string;
    export default src;
}

declare namespace JSX {
    interface IntrinsicElements {
        "li-title": any;
        "li-content": any;
        "menu-component": any;
        "menu-handle": any;
    }
}

declare module "*.md" {
    const content: string;
    export default content;
}

declare const Caman: any;

declare module "react-butterfiles" {
    export type SelectedFile = {
        id: string;
        name: string;
        type: string;
        size: number;
        src: {
            file?: File;
            base64?: string;
        };
    };

    export type FileError = {
        id: string;
        type:
            | "unsupportedFileType"
            | "maxSizeExceeded"
            | "multipleMaxSizeExceeded"
            | "multipleMaxCountExceeded"
            | "multipleNotAllowed";
        file?: SelectedFile | File;
    };

    export type BrowseFilesParams = {
        onSuccess?: (files: SelectedFile[]) => void;
        onError?: (errors: FileError[], files: SelectedFile[]) => void;
    };

    export type FilesRenderChildren = {
        browseFiles: (params: BrowseFilesParams) => void;
        getDropZoneProps: (additionalProps?: Object) => Object;
        getLabelProps(additionalProps?: Object): Object;
        validateFiles(files: Array<SelectedFile> | Array<File>): Array<FileError>;
    };

    export type FilesRules = {
        accept: string[];
        multiple?: boolean;
        maxSize?: number | string;
        multipleMaxSize?: number | string;
        multipleMaxCount?: number;
        convertToBase64?: boolean;
        onSuccess?: (files: SelectedFile[]) => void;
        onError?: (errors: FileError[], files: SelectedFile[]) => void;
    };

    export type FilesProps = FilesRules & {
        children(params: FilesRenderChildren): React.ReactNode;
        id?: string;
    };

    const Files: React.ComponentType<FilesProps>;

    export default Files;
}

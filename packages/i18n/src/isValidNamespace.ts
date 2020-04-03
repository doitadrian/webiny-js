export default (value: any): boolean => {
    return typeof value === "string" && /^[0-9a-z\/-]*$/.test(value);
};

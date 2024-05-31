export const getacces = (acces) => {
    switch (acces) {
        case "prive":
            return "🔒";
        case "public":
            return "🌐";
        default:
            return "";
    }
};

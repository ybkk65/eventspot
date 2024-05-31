export const getmajorite = (majorite) => {
    switch (majorite) {
        case "majeur":
            return "👨‍💼";
        case "mineur":
            return "🧒";
        case "tout âges":
            return "👩‍⚕️👦";
        default:
            return "";
    }
};

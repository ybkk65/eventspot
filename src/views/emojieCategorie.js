export const getCategoryEmoji = (categoryName) => {
switch (categoryName) {
  case "Musique":
        return "🎵";
    case "Sport":
        return "🏀";
    case "Théâtre":
        return "🎭";
    case "Art":
        return "🎨";
    case "Conférence":
        return "🎤";
    case "Cinéma":
        return "🎬";
    case "Danse":
        return "💃";
    case "Exposition":
        return "🖼️";
    case "Festival":
        return "🎉";
    case "Gastronomie":
        return "🍴";
    case "Littérature":
        return "📚";
    case "Mode":
        return "👗";
    case "Rencontre":
        return "🤝";
    case "Technologie":
        return "💻";
    case "Voyage":
        return "✈️";
    case "Mariage":
        return "💒";
    case "Visioconférence":
        return "💻";
    case "Séminaire":
        return "📋";
    default:
        return "";
    }
};

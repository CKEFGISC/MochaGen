// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    container: {
        center: true,
    },
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            prefix: "nextui", // prefix for themes variables
            addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
            defaultTheme: "light", // default theme from the themes object
            defaultExtendTheme: "light", // default theme to extend on custom themes
            layout: {
                spacingUnit: 4, // in px
                disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
                dividerWeight: "1px", // h-divider the default height applied to the divider component
                fontSize: {
                    tiny: "0.75rem", // text-tiny
                    small: "0.875rem", // text-small
                    medium: "1rem", // text-medium
                    large: "1.125rem", // text-large
                },
                lineHeight: {
                    tiny: "1rem", // text-tiny
                    small: "1.25rem", // text-small
                    medium: "1.5rem", // text-medium
                    large: "1.75rem", // text-large
                },
                radius: {
                    small: "8px", // rounded-small
                    medium: "12px", // rounded-medium
                    large: "14px", // rounded-large
                },
                borderWidth: {
                    small: "1px", // border-small
                    medium: "2px", // border-medium (default)
                    large: "3px", // border-large
                },
            },
            themes: {
                mocha: {
                    // custom theme
                    colors: {
                        background: "#F9E9DA",
                        foreground: "#573C27",
                        primary: {
                            50: "#FDF8F2",
                            100: "#FEF9F3",
                            200: "#FDF3E7",
                            300: "#F9E9DA",
                            400: "#F4DDCD",
                            500: "#EDCDBB",
                            600: "#CB9C88",
                            700: "#AA705E",
                            800: "#89493B",
                            900: "#712C23",
                            DEFAULT: "#EDCDBB",
                            foreground: "#573C27",
                        },
                        focus: "#DB562E",
                    },
                },
            },
        }),
    ],
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#001F3F",
                secondary: "#FF4136",
                background: "#F8F9FA",
                text: "#333333",
            },
            boxShadow: {
                'light': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                'inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

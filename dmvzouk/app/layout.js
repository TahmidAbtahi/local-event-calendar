import "./globals.css";

export const metadata = {
  title: "DMV Zouk — DC Metro Area Brazilian Zouk Calendar",
  description:
    "Community calendar of Brazilian Zouk classes, socials, weekenders, and festivals in the DC Metro Area.",
  openGraph: {
    title: "DMV Zouk Calendar",
    description: "Brazilian Zouk events in the DC Metro Area",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

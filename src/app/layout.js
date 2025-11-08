import "@/app/global.css";
import "@/app/global-desktop.css";
import "@/app/global-dark.css";
import { siteConfig } from "@/app/lib/site.config";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}

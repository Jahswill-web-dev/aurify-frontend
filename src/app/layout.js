import "./globals.css";
import Footer from "@/components/footer/footer";
import StoreProvider from "./lib/StoreProvider";

export const metadata = {
  title: "Aurify",
  description:
    "Aurify summarizes PDF pages into brief summaries and converts them to audio.",
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className="bg-secondary">
          {children}
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
}

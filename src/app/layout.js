import "./globals.css";
import StoreProvider from "./lib/StoreProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata = {
  title: "Aurify AI",
  description:
    "Aurify summarizes PDF pages into brief summaries and converts them to audio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-off-white max-w-[1557px] mx-auto">
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

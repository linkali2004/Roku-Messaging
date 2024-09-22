import localFont from "next/font/local";
import "./globals.css";
import SocketContextProvider from "@/context/SocketContext";
import RegistrationContextProvider from "@/context/RegistrationContext";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import OverallContextProvider from "@/context/OverallContext";
import ChatContextProvider from "@/context/ChatContext";
import CallContextProvider from "@/context/CallContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Roku Messaging",
  description: "A service where you can chat and video call",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OverallContextProvider>
        <RegistrationContextProvider>
          <SocketContextProvider>
            <CallContextProvider>
            <ChatContextProvider>
            <ResponsiveLayout>
            {children}
            </ResponsiveLayout>
            </ChatContextProvider>
            </CallContextProvider>
          </SocketContextProvider>
        </RegistrationContextProvider>
        </OverallContextProvider>
      </body>
    </html>
  );
}

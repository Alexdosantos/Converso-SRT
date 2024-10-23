import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Text to SRT Converter",
  description: "O **Text to SRT Converter** é uma ferramenta prática que converte texto simples em arquivos de legendas no formato SRT (SubRip Subtitle). Ideal para criadores de conteúdo, editores de vídeo e tradutores, essa ferramenta transforma rapidamente diálogos ou transcrições em legendas sincronizadas, prontas para serem usadas em vídeos. Basta inserir o texto, ajustar o tempo das falas e exportar o arquivo SRT. Com uma interface simples e eficiente, o **Text to SRT Converter** agiliza o processo de criação de legendas, tornando-o acessível para qualquer pessoa, mesmo sem experiência técnica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: "ســـــامانه مـــــدیریت شـــــارژ",
  description: "ســـــامانه مـــــدیریت شـــــارژ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

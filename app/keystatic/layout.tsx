import '@/app/globals.css';

export default function KeystaticLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="font-inter bg-black text-white">
        {children}
        </body>
        </html>
    );
}

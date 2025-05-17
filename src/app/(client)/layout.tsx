import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'F8 - Học lập trình để đi làm',
    description: 'Học lập trình để đi làm với các khóa học xây dựng từ cơ bản đến nâng cao.',
    icons: 'https://fullstack.edu.vn/favicon/favicon_32x32.png',
    openGraph: {
        title: 'F8 - Học lập trình để đi làm',
        description: 'Học lập trình để đi làm với các khóa học xây dựng từ cơ bản đến nâng cao.',
        images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
        url: 'https://fullstack.edu.vn',
        type: 'website',
    },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <main>
            {children}
        </main>
    )
}

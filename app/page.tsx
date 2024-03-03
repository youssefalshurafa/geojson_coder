import HomePage from '@/components/HomePage';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
    return (
        <main className="p-12 flex flex-col justify-center items-center gap-8 font-poppins bg-gradient-to-tr from-[#4158D0]  via-[#C850C0] to-[#FFCC70]  min-h-screen ">
            <HomePage />
            <Toaster />
        </main>
    );
}
//bg-[url('../public//120.jpg')] bg-cover bg-no-repeat

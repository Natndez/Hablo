import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

// Children is essentially the JSX from page.tsx, Next defaults to layout for the basic page structure, then renders the children(page.tsx) within the layout
type Props = {
    children: React.ReactNode;
};

// Any page within the @/app/(marketing)/ directory will conform to this layout
const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MarketingLayout;
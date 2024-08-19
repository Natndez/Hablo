// Doesnt need to be marked as use client as it is only used in a client component

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";

// Types for header! :)
type Props = {
    hearts: number;
    percentage: number;
    hasActiveSubscription: boolean;
};

export const Header = ({ 
    hearts,
    percentage,
    hasActiveSubscription,
 }: Props) => {

    // For the exit modal
    const { open } = useExitModal();

    return (
            <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
                <X 
                    onClick={open} // TODO: add exit onClick
                    className="text-slate-500 hover:opactity-75 transition cursor-pointer"
                />
                {/* From shad */}
                <Progress value={percentage}/>
                <div className="text-rose-500 flex items-center font-bold">
                    <Image 
                        src="temp/heart.svg"
                        height={28}
                        width={28}
                        alt="Heart"
                        className="mr-2"
                    />
                    {hasActiveSubscription
                        ? <InfinityIcon className="h-6 w-6 stroke-[3]"/>
                        : hearts
                    }
                </div>
            </header>
    );
}
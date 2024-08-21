import { cn } from "@/lib/utils";
import { challenges } from "@/db/schema";
import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

// Props for Card
type Props = {
    id: number;
    imageSrc: string | null;
    audioSrc: string | null;
    text: string;
    shortcut: string;
    selected?: boolean;
    onClick: () => void;
    disabled?: boolean;
    status?: "correct" | "wrong" | "none";
    type: typeof challenges.$inferSelect["type"];
};

export const Card = ({ 
    id,
    imageSrc,
    audioSrc,
    text,
    shortcut,
    selected,
    onClick,
    disabled,
    status,
    type,
 }: Props) => {
    // setting up use audio
    const [audio, _, controls] = useAudio({ src: audioSrc || ""}); // no need for second parameter (related to HTML, not sure what it is)
    
    // Using callback because this function will serve as a dependency
    const handleClick = useCallback(() => {
        if(disabled) return; // Break right away

        // On click, use controls to play audio
        controls.play();
        onClick();
    }, [disabled, onClick, controls]); // dependency array

    // To use the keyboard
    useKey(shortcut, handleClick, {}, [handleClick]); // Shortcut is the index of a question + 1 (to account for zero indexing)

    return (
        

        <div
            onClick={handleClick}
            // Using cn to assign dynamic classes based on selected, status, and question type
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
                selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
                selected && status === "correct" 
                    && "border-green-300 bg-green-100 hover:bg-green-100",
                selected && status === "wrong" 
                    && "border-rose-300 bg-rose-100 hover:bg-rose-100",
                disabled && "pointer-events-none hover:bg-white",
                type === "ASSIST" && "lg:p-3 w-full"
            )}
        >   
            {audio /* need to render audio "element" anywhere on screen */}
            {imageSrc && (
                <div
                    className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full"
                >
                    <Image 
                        src={imageSrc} // image source from challengeOptions db
                        fill
                        alt={text}     // text from challengeOptions db
                    />
                </div>
            )}
            <div className={cn(
                    "flex items-center justify-between",
                    type === "ASSIST" && "flex-row-reverse"
                )}>
                    {type === "ASSIST" && <div />}
                    <p className={cn(
                        "text-neutral-600 text-sm lg:text-base",
                        selected && "text-sky-500",
                        selected && status === "correct" 
                            && "text-green-500",
                        selected && status === "wrong" 
                            && "text-rose-500",
                    )}>
                        {/* "text" field contains text from challenge options */}
                        {text} 
                    </p>
                    <div className={cn(
                        "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
                        selected && "border-sky-300 text-sky-500",
                        selected && status === "correct" 
                            && "border-green-500 text-green-500",
                        selected && status === "wrong" 
                            && "border-rose-500 text-rose-500",
                    )}>
                        {shortcut}
                    </div>
            </div>
        </div>
    );
}

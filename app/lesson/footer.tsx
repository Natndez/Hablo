import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
    onCheck: () => void;
    status: "correct"|"wrong"|"none"|"completed"; // New status here only used in the footer "completed." It will be used when the entire lesson is complete
    disabled?: boolean;
    lessonId?: boolean; // ???
}

export const Footer = ({ 
    onCheck,
    status,
    disabled,
    lessonId
 }: Props ) => {
    // Footer button will depend on device type...
    const isMobile = useMedia("(max-width: 1024px)");
    // To press enter key to move on instead of clicking button
    useKey("Enter", onCheck, {}, [onCheck]) 
    
    return (
        <footer className={cn(
            "lg:h-[140px] h-[100px] border-t-2",
            status === "correct" && "border-transparent bg-green-100",
            status === "wrong" && "border-transparent bg-rose-100",
        )}>
            <div className="max-w-[1040px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {/* TODO: Add arrow icon to button */}
                <Button
                    disabled={disabled}
                    className="ml-auto"
                    onClick={onCheck}
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "danger" : "secondary"}
                >
                    {status === "none" && "Check"}
                    {status === "wrong" && "Try Again"}
                    {status === "correct" && "Next"}
                    {status === "completed" && "Continue"}
                </Button>
            </div>
        </footer>
    );  
}
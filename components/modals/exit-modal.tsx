"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
 } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";

// Exit Modal!! :)
export const ExitModal = () => {
    // Defining router and client (for hydration errors)
    const router = useRouter();
    const [ isClient, setIsClient ] = useState(false);

    // Getting exit modal as well
    const { isOpen, close } = useExitModal();

    // Accounting for hydration errors here
    useEffect(() => setIsClient(true), []);
    if (!isClient) { return null; }
    
    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image 
                            src="temp/mascot_sad.svg"
                            alt="Sad Mascot"
                            height={80}
                            width={80}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Slow down, don't go!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        You're leaving the lesson, are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4 ">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                            Keep learning
                        </Button>
                        <Button variant="dangerOutline" className="w-full" size="lg" onClick={() => {
                            close();
                            router.push("/learn")
                        }}>
                            Exit session
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
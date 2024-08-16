"use client";

import Link from "next/link";
// Lucide icons
import {
    Check, 
    Crown,
    Star
} from "lucide-react"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
    id: number;
    index: number;
    totalCount: number;
    locked?: boolean;
    current?: boolean;
    percentage: number;
};

export const LessonButton = ({ 
    id,
    index,
    totalCount,
    locked,
    current,
    percentage,
 }: Props) => {
    // As the lesson buttons are positioned using calculations, we need to do some tricky stuff here

    // Length of the cycle
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    // The positioning for the button
    let indentationLevel;

    // Checking cycleIndex and assigning different indentation levels
    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex;
    } else if (cycleIndex <= 4) {
        indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex;
    }
    else {
        indentationLevel = cycleIndex - 8;
    }

    // The position of the right side of the button
    const rightPosition = indentationLevel * 40; // 40 is our spacing (experiment with dif values)
    
    const isFirst = index === 0;            // Is this the first lesson
    const isLast = index === totalCount;    // Is this the last lesson
    const isCompleted = !current && !locked; // Is the lesson completed?

    // To select the right icon
    const Icon = isCompleted? Check : isLast ? Crown: Star;

    const href = isCompleted ? `/lesson/${id}` : "/lesson"; // To send to right address

    return (
        <Link href={href} aria-disabled={locked} style={{ pointerEvents: locked ? "none" : "auto" }}>
            <div
                className="relative"
                style={{
                    right: `${rightPosition}px`,
                    marginTop: isFirst && !isCompleted ? 60 : 24
                }}
            >
                {/* If current return the following... (havent seen this syntax before) */}
                {current ? (
                    <div>
                        Current
                    </div>
                ) : (
                    <div>
                        Not current
                    </div>
                )}
            </div>
        </Link>
    );
}
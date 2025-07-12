import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

//Used by ShadCN
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type Condition<T> = (element: T) => boolean;

export function partitionFilter<T>(arr: T[], condition: Condition<T>): T[] {
	let left = 0;
	let right = arr.length - 1;

	while (left <= right) {
		while (condition(arr[left])) {
			left++;
		}
		while (!condition(arr[right])) {
			right--;
		}
		if (left <= right) {
			[arr[left], arr[right]] = [arr[right], arr[left]];
			left++;
			right--;
		}
	}

	return arr.slice(0, left);
}


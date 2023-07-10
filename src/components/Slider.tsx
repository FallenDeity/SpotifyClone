"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import React from "react";

interface SliderProps {
	value?: number;
	onChange?: (value: number) => void;
}

export default function Slider({ value = 0, onChange }: SliderProps): React.JSX.Element {
	const handleChange = (value: number[]): void => {
		onChange?.(Number(value[0]));
	};
	return (
		<RadixSlider.Root
			className="relative flex h-5 w-full touch-none select-none items-center"
			defaultValue={[0]}
			onValueChange={handleChange}
			value={[value]}
			min={0}
			max={100}
			step={1}>
			<RadixSlider.Track className="relative h-[.5vh] grow rounded-full bg-neutral-600">
				<RadixSlider.Range className="absolute h-full rounded-full bg-white" />
			</RadixSlider.Track>
			<RadixSlider.Thumb className="block h-2 w-2 rounded-full bg-white shadow focus:outline-none" />
		</RadixSlider.Root>
	);
}

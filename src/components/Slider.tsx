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
			className="relative flex items-center select-none touch-none w-full h-5"
			defaultValue={[0]}
			onValueChange={handleChange}
			value={[value]}
			min={0}
			max={100}
			step={1}>
			<RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
				<RadixSlider.Range className="absolute bg-white rounded-full h-full" />
			</RadixSlider.Track>
			<RadixSlider.Thumb className="block w-2 h-2 bg-white rounded-full focus:outline-none shadow" />
		</RadixSlider.Root>
	);
}

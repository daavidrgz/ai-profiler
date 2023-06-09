import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";

export interface ButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> { }

export interface DivProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> { }

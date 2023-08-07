import { useMediaQuery } from 'react-responsive';

export enum ScreenSize {
	XS = 1,
	S = 768,
	M = 1024,
	L = 1200,
}

interface Props {
	children: JSX.Element;
}

export function ScreenXS({ children }: Props) {
	const isXS = useMediaQuery({
		minWidth: ScreenSize.XS,
		maxWidth: ScreenSize.S - 1,
	});
	return isXS ? children : null;
}

export function ScreenS({ children }: Props) {
	const isS = useMediaQuery({
		minWidth: ScreenSize.S,
		maxWidth: ScreenSize.M - 1,
	});
	return isS ? children : null;
}

export function ScreenM({ children }: Props) {
	const isM = useMediaQuery({
		minWidth: ScreenSize.M,
		maxWidth: ScreenSize.L - 1,
	});
	return isM ? children : null;
}

export function ScreenL({ children }: Props) {
	const isL = useMediaQuery({ minWidth: ScreenSize.L });
	return isL ? children : null;
}

export function AboveScreenXs({ children }: Props) {
	const isAboveXS = useMediaQuery({ minWidth: ScreenSize.XS });
	return isAboveXS ? children : null;
}

export function AboveScreenS({ children }: Props) {
	const isAboveS = useMediaQuery({ minWidth: ScreenSize.S });
	return isAboveS ? children : null;
}

export function AboveScreenM({ children }: Props) {
	const isAboveM = useMediaQuery({ minWidth: ScreenSize.M });
	return isAboveM ? children : null;
}

export function AboveScreenL({ children }: Props) {
	const isAboveL = useMediaQuery({ minWidth: ScreenSize.L });
	return isAboveL ? children : null;
}

export function BelowScreenS({ children }: Props) {
	const isBelowS = useMediaQuery({ maxWidth: ScreenSize.S - 1 });
	return isBelowS ? children : null;
}

export function BelowScreenM({ children }: Props) {
	const isBelowM = useMediaQuery({ maxWidth: ScreenSize.M - 1 });
	return isBelowM ? children : null;
}

export function BelowScreenL({ children }: Props) {
	const isBelowL = useMediaQuery({ maxWidth: ScreenSize.L - 1 });
	return isBelowL ? children : null;
}

import type { PropsWithChildren } from "react";

export enum ButtonSize {
	Small,
	Medium,
	Large,
};

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	size?: ButtonSize;
};

function Button({size = ButtonSize.Medium, className, children, ...props}: PropsWithChildren<ButtonProps>) {
	const baseStyles = "bg-gray-700 hover:bg-gray-600 border-gray-200 border-1 active:bg-gray-800";

	const sizeStyles = {
		[ButtonSize.Small]: "px-2 py-1 text-xl",
		[ButtonSize.Medium]: "px-4 py-2 text-2xl",
		[ButtonSize.Large]: "px-6 py-3 text-3xl",
	};

	return (
		<button
			className={[baseStyles, sizeStyles[size], className].join(" ")}
			{...props}
		>{children}</button>
	);
}

export default Button;
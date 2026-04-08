import type { PropsWithChildren } from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	// NOTE: might be needed in the future
};

function Button({className, children, ...props}: PropsWithChildren<ButtonProps>) {
	const baseStyles = "bg-gray-700 px-4 py-2 hover:bg-gray-600 border-gray-200 border-1 active:bg-gray-800";

	return (
		<button
			className={[baseStyles, className].join(" ")}
			{...props}
		>{children}</button>
	);
}

export default Button;
import { Box, Button } from "@mui/material";
import styles from "./rounded_button.module.css";

const RoundedButton = ({
	background,
	size,
	route,
	forPath,
	children,
	onClick,
	type,
	className,
	disabled,
}) => {
	return (
		<Button
			className={`${className} ${styles.rounded_button} 
						${background === "light" ? styles.bg_light : styles.bg_dark}
						${forPath === route ? styles.active_button : ""} 
						${
							type === "multi" && size === "medium"
								? styles.multi_medium
								: type === "multi" && size === "small"
								? styles.multi_small
								: type === "single" && size === "medium"
								? styles.single_medium
								: type === "single" && size === "small"
								? styles.single_small
								: ""
						}
					`}
			onClick={onClick}
			disabled={disabled}
		>
			{type === "single" ? (
				children[0]
			) : (
				<Box
					component="span"
					className="w-full h-full flex flex-wrap justify-center p-2 gap-2 items-center"
				>
					<Box component="span" className="max-w-[20%] relative">
						{children[0]}
					</Box>
					<Box component="span" className="max-w-[80%] font-karla text-xl uppercase">
						{children[1]}
					</Box>
				</Box>
			)}
		</Button>
	);
};

export default RoundedButton;

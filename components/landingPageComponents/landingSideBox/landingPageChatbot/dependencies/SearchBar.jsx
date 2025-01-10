import { FormControl, TextField } from "@mui/material";
import { aoiTypeAtom, botMessageAtom } from "@/jotai/index";
import { useAtom, useAtomValue } from "jotai";

function SearchBar() {
	const [message, setMessage] = useAtom(botMessageAtom);
	const aoiType = useAtomValue(aoiTypeAtom);

	const onChangeHandler = (e) => setMessage(e.target.value);

	return (
		<>
			<FormControl
				sx={{
					position: "absolute",
					bottom: 27.9,
					width: "87%",
					backgroundColor: "black",
					zIndex: 200,
				}}
			>
				<TextField
					id="my-input"
					aria-describedby="my-helper-text"
					variant="outlined"
					placeholder={`Search for ${aoiType}`}
					onChange={onChangeHandler}
					value={message}
				/>
			</FormControl>
		</>
	);
}

export default SearchBar;

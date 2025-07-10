import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAtomValue, useSetAtom } from "jotai";
import { listOfAllOrderDataAtom, listOfFilteredOrderDataAtom } from "../../../jotai";

/**
 * This component is used to search in the order data using the order name
 */
function SearchBarForOrders() {
	const SET_FILTERED_ORDER_DATA = useSetAtom(listOfFilteredOrderDataAtom);
	const ALL_ORDER_DATA = useAtomValue(listOfAllOrderDataAtom);

	// Search and filter the all orders using the name
	const handleChange = (event) => {
		SET_FILTERED_ORDER_DATA(
			ALL_ORDER_DATA.filter((order) => {
				return order.order?.aoi.name.toLowerCase().includes(event.target.value);
			})
		);
	};

	return (
		ALL_ORDER_DATA && (
			<TextField
				id="search"
				type="search"
				label="Search"
				onChange={handleChange}
				sx={{ width: "100%" }}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon />
						</InputAdornment>
					),
				}}
			/>
		)
	);
}

export default SearchBarForOrders;

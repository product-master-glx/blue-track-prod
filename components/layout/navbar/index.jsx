import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import FileDownloadSelector from "@/components/downloadAnnexures";
import {
	cookiesValuesAtom,
	currentSelectedPondDateAtom,
	currentSelectedStatusOnRegionInsightAtom,
	isUserOnLandingPageAtom,
	pondDateArrayAtom,
	showGraphBoxAtom,
	showLoadingScreenAtom,
	showPondInsightPageAtom,
	showRegionInsightPageAtom,
	userAccessTokensAtom,
	userDataAtom,
} from "../../../jotai";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-hot-toast";
// import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";
import userLogOutHandler from "@/api-handlers/authentication-handler/log_out.handler";

const openEmailDialogBox = () => {
	window.open("mailto:info@galaxeye.space");
};

/**
 * This component renders a list of options to route in the navbar with a logo
 */
function Navbar() {
	const [anchorElUser, setAnchorElUser] = useState(null);
	const SET_UAT = useSetAtom(userAccessTokensAtom);
	const SET_COOKIES = useSetAtom(cookiesValuesAtom);
	const IS_USER_ON_LANDING_PAGE = useAtomValue(isUserOnLandingPageAtom);
	const SET_POND_INSIGHT_DISPLAY_BOOLEAN = useSetAtom(showPondInsightPageAtom);
	const SET_REGION_INSIGHT_DISPLAY_BOOLEAN = useSetAtom(showRegionInsightPageAtom);
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);
	const SET_GRAPH_BOX_DISPLAY_BOOLEAN = useSetAtom(showGraphBoxAtom);
	const SET_CURRENT_SELECTED_STATUS_ON_REGION_INSIGHT = useSetAtom(
		currentSelectedStatusOnRegionInsightAtom
	);
	const SET_CURRENT_SELECTED_POND_DATE = useSetAtom(currentSelectedPondDateAtom);
	const SET_POND_DATE_ARRAY = useSetAtom(pondDateArrayAtom);

	const [user, setUser] = useAtom(userDataAtom);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const logoutAndCloseUserMenu = (event) => {
		logout();
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const navigate = useNavigate();

	const logout = async () => {
		toast.loading("Logging Out...", {
			id: "logging-out",
		});
		await userLogOutHandler();
		//remove accessToken from cookie
		// Cookies.remove("accessToken");
		localStorage.clear();
		SET_COOKIES({});
		SET_UAT(null);
		setUser({});
		toast.success("Logged Out", {
			id: "logging-out",
		});
		window.location.href = "/sign-in";
	};

	const navigateBackToLandingPage = () => {
		SET_LOADING_SCREEN_BOOLEAN(true);
		SET_POND_INSIGHT_DISPLAY_BOOLEAN(false);
		SET_REGION_INSIGHT_DISPLAY_BOOLEAN(true);
		SET_GRAPH_BOX_DISPLAY_BOOLEAN(false);
		SET_CURRENT_SELECTED_STATUS_ON_REGION_INSIGHT("all");
		SET_POND_DATE_ARRAY([]);
		SET_CURRENT_SELECTED_POND_DATE(null);
		navigate("/");
	};

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "light dark", paddingY: "3px", height: "100%" }}
		>
			<Container maxWidth="xxl" sx={{ zIndex: 15000 }}>
				<Toolbar
					style={{
						minHeight: "74px",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: "16px",
					}}
				>
					<img
						src={"/galaxeye-white.png"}
						width="100px"
						alt="Galaxeye Logo"
						loading="lazy"
					/>

					<Box sx={{ flexGrow: 1 }}></Box>
					{IS_USER_ON_LANDING_PAGE ? (
						<></>
					) : (
						<Box
							sx={{
								flexGrow: 0,
								display: { md: "flex" },
								alignItems: "flex-end",
							}}
						>
							<Button
								variant="contained"
								onClick={navigateBackToLandingPage}
								sx={{
									width: "100%",
									justifyContent: "space-between",
									backgroundColor: "#121A2B",
									color: "#fff",
									border: "1px solid #004AAD",
									"&:hover": {
										backgroundColor: "#1a1a1a",
									},
								}}
								startIcon={<HomeIcon />}
							>
								Home
							</Button>
						</Box>
					)}
					<FileDownloadSelector />
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar>
									{user?.name?.split(" ")?.[0]?.[0]}
									{user?.name?.split(" ")?.[1]?.[0]}
								</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<Typography key="Name" textAlign="start" px="10px">
								Name : {user?.name}
							</Typography>
							<Typography
								key="Email"
								textAlign="start"
								px="10px"
								paddingBottom="10px"
							>
								Email : {user?.email}
							</Typography>

							<MenuItem key="Contact Us" onClick={openEmailDialogBox}>
								<Typography textAlign="center">Contact Us</Typography>
							</MenuItem>
							<MenuItem key="Logout" onClick={logoutAndCloseUserMenu}>
								<Typography textAlign="center">Log Out</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Navbar;

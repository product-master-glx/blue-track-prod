import { useState } from "react";
import { Box, Button, Menu, MenuItem, CircularProgress } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import endpoints from "@/constants/endpoints";
import request_handler from "@/api-handlers/request.handler";
function FileDownloadSelector() {
	const [anchorEl, setAnchorEl] = useState(null);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [downloadingId, setDownloadingId] = useState(null);

	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		if (anchorEl) {
			// Menu is open → close it
			handleClose();
		} else {
			// Menu is closed → open and fetch files
			setAnchorEl(event.currentTarget);
			fetchFiles();
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const fetchFiles = async () => {
		setLoading(true);
		try {
			const response = await request_handler({
				method: "get",
				endpoint: endpoints.getAllAnnexures,
				data: {},
				successToast: false,
			});
			const sortedFiles = response?.data?.sort((a, b) => a?.id - b?.id);
			setFiles(sortedFiles || []);
		} catch (err) {
			console.error("Failed to fetch annexures:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async (fileId) => {
		setDownloadingId(fileId);

		try {
			const downloadInfo = await request_handler({
				method: "get",
				endpoint: `${endpoints.downloadFile}/${fileId}`,
				data: {},
				successToast: false,
			});

			const { filename, download_url } = downloadInfo.data;
			const link = document.createElement("a");
			link.href = download_url;
			link.download = filename || "download";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Download failed:", err);
			alert("Failed to download file.");
		} finally {
			setDownloadingId(null);
			setTimeout(() => {
				handleClose();
			}, 3000);
		}
	};

	return (
		<Box sx={{ maxWidth: 400, mx: "auto", mr: 3 }}>
			<Button
				variant="contained"
				onClick={handleClick}
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
				endIcon={<ArrowDropDown />}
				disabled={loading}
				aria-controls={open ? "file-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
			>
				ANNEXURES
			</Button>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose} // closes on outside click automatically
				slotProps={{
					paper: {
						sx: {
							backgroundColor: "#000000",
							color: "#fff",
							maxHeight: 300,
							minWidth: anchorEl?.offsetWidth || 300,
							mt: 1,
						},
					},
				}}
			>
				{loading ? (
					<MenuItem disabled>
						<CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
						Loading files...
					</MenuItem>
				) : files.length === 0 ? (
					<MenuItem disabled>No files available</MenuItem>
				) : (
					files.map((file) => (
						<MenuItem
							key={file.id}
							onClick={() => handleDownload(file.id)}
							disabled={downloadingId !== null}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								width: 300,
								maxWidth: "100%",
							}}
						>
							{downloadingId === file.id && (
								<CircularProgress size={16} sx={{ color: "white" }} />
							)}
							<Box
								component="span"
								title={file.filename}
								sx={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									display: "inline-block",
									maxWidth: "100%",
									flexGrow: 1,
								}}
							>
								{downloadingId === file.id ? "Downloading..." : file.filename}
							</Box>
						</MenuItem>
					))
				)}
			</Menu>
		</Box>
	);
}

export default FileDownloadSelector;

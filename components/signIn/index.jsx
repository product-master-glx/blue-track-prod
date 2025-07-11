import { useEffect, useState, useCallback } from "react";
import {
	Avatar,
	Box,
	Button,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import userSignInHandler from "@/api-handlers/authentication-handler/sign_in.handler";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { loginStartedAtom, loginOtpValidityAtom } from "@/jotai/index";

/**
 * This component renders a form for signing in
 */
const SignIn = () => {
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const [otpValidity, setOtpValidity] = useAtom(loginOtpValidityAtom);

	const [loginStarted, setLoginStarted] = useAtom(loginStartedAtom);

	const [countdownStarted, setCountdownStarted] = useState(false);

	const signInStarterButton = async (e) => {
		try {
			e.preventDefault();
			const email = e.target["email"].value;

			setLoading(true);

			await userSignInHandler({
				email,
			});

			setLoading(false);
			setLoginStarted(true);
		} catch (error) {
			console.log(error);
			setLoginStarted(false);
		}
	};

	/**
	 * This function sends a request for user signing in
	 */
	const signInButton = async (e) => {
		try {
			e.preventDefault();
			const email = e.target["email"].value;
			const password = e.target["password"].value;

			setLoading(true);

			await userSignInHandler({
				email,
				otp: password,
			});

			setLoading(false);
			setLoginStarted(false);
		} catch (error) {
			console.log(error);
		}
	};

	const startCountdown = useCallback(() => {
		setCountdownStarted(true);
		const interval = setInterval(() => {
			setOtpValidity((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, [setOtpValidity]);

	useEffect(() => {
		if (otpValidity === 180) {
			startCountdown();
		}
		if (otpValidity === 0) {
			setCountdownStarted(false);
		}
	}, [otpValidity, startCountdown]);

	return (
		<Grid container component="main" sx={{ height: "100vh" }}>
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: `url(${"../../cover.jpeg"})`,
					backgroundRepeat: "no-repeat",
					backgroundColor: (t) =>
						t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<Grid
				item
				xs={12}
				sm={8}
				md={5}
				component={Paper}
				elevation={6}
				square
				sx={{
					backgroundColor: "black",
				}}
			>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5" color="white">
						Sign in to Galaxeye Blue
					</Typography>
					<form onSubmit={loginStarted ? signInButton : signInStarterButton}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							autoFocus
							sx={{
								width: "38vw",
							}}
						/>
						{loginStarted && (
							<TextField
								margin="normal"
								required
								fullWidth
								label="Password"
								id="password"
								type={passwordVisible ? "text" : "password"}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={togglePasswordVisibility}
												edge="end"
											>
												{passwordVisible ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						)}
						{countdownStarted && (
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
									marginTop: 3,
								}}
							>
								<Typography>OTP is Valid For: {otpValidity} sec</Typography>

								<Button
									type="submit"
									variant="contained"
									disabled={otpValidity !== 0}
									onClick={() => {
										setLoginStarted(false);
									}}
								>
									Resend Otp
								</Button>
							</Box>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							Sign In
						</Button>
					</form>

					<Typography component="p" variant="p" color="white">
						Don&lsquo;t have an account?{" "}
						<Link
							to="/sign-up"
							style={{
								textDecoration: "underline",
								color: "#ce93d8",
								fontWeight: 600,
							}}
						>
							Create account
						</Link>
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
};
export default SignIn;

import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
import userSignUpHandler from "@/api-handlers/authentication-handler/sign_up.handler";
import { useAtom } from "jotai";
import { signUpOtpValidityAtom, signUpStartedAtom } from "@/jotai/index";

/**
 * This component renders a form for signing up
 */
const SignUp = () => {
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const [signUpStarted, setSignUpStarted] = useAtom(signUpStartedAtom);
	const [otpValidity, setOtpValidity] = useAtom(signUpOtpValidityAtom);
	const [countdownStarted, setCountdownStarted] = useState(false);

	const signUpStartedButton = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const email = e.target["email"].value;
			const firstName = e.target["firstName"].value;
			const lastName = e.target["lastName"].value;

			const userName = `${firstName} ${lastName}`;

			await userSignUpHandler({
				email,
				name: userName,
			});
			setLoading(false);
			setSignUpStarted(true);
		} catch (err) {
			console.log(err);
		}
	};

	const signInButton = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const email = e.target["email"].value;
			const password = e.target["password"].value;
			const firstName = e.target["firstName"].value;
			const lastName = e.target["lastName"].value;

			const userName = `${firstName} ${lastName}`;

			await userSignUpHandler({
				email,
				otp: password,
				name: userName,
			});
			setLoading(false);
		} catch (err) {
			console.log(err);
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
						Welcome to Galaxeye Blue
					</Typography>
					<form
						onSubmit={signUpStarted ? signInButton : signUpStartedButton}
						autoComplete="off"
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								flexWrap: "wrap",
							}}
						>
							<TextField
								margin="normal"
								required
								name="firstName"
								id="firstName"
								label="First Name"
								autoFocus
								sx={{
									width: "48%",
									"@media (max-width: 450px)": {
										width: "100%",
									},
								}}
							/>
							<TextField
								margin="normal"
								required
								name="lastName"
								id="lastName"
								label="Last Name"
								sx={{
									width: "48%",
									"@media (max-width: 450px)": {
										width: "100%",
									},
								}}
							/>
						</Box>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							autoComplete="new-password"
							sx={{
								width: "38vw",
							}}
						/>
						{signUpStarted && (
							<TextField
								margin="normal"
								required
								fullWidth
								label="Password"
								id="password"
								autoComplete="new-password"
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
										setSignUpStarted(false);
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
							Create account
						</Button>
					</form>
					<Typography component="p" variant="p" color="white">
						Already have an account?{" "}
						<Link
							to="/sign-in"
							style={{
								textDecoration: "underline",
								color: "#ce93d8",
								fontWeight: 600,
							}}
						>
							Sign in
						</Link>
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
};
export default SignUp;

import React, { useState } from "react";
import {
	View,
	SafeAreaView,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Colors from "../constants/Colors";
import { Button } from "react-native-paper";
import CountDown from "react-native-countdown-component";
import * as authActions from "../store/actions/Auth";
import { useDispatch } from "react-redux";
import LoadingScreen from "./LoadingScreen";

export default function OtpScreen({ navigation, route }) {
	const { phoneNumber, name } = route.params;
	const [canSendOtp, setCanSendOtp] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState("");
	const dispatch = useDispatch();
	const resendOtp = async () => {
		setCanSendOtp(false);
		try {
			setIsLoading(true);
			await dispatch(authActions.signIn(phoneNumber));
			setIsLoading(false);
			navigation.navigate("Otp", { phoneNumber: phoneNumber, name: name });
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			alert("Something went wrong");
		}
	};
	const verificationHandler = async () => {
		try {
			setIsLoading(true);
			await dispatch(
				authActions.authenticatePhoneNumber(name, code, phoneNumber)
			);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			alert("Something went wrong");
		}
	};
	if (isLoading) {
		return <LoadingScreen />;
	}
	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={{
					backgroundColor: "#000",
					borderRadius: 50,
					padding: 10,
					alignSelf: "flex-start",
					marginLeft: 10,
				}}
			>
				<Ionicons name="arrow-back" size={24} color={Colors.primary} />
			</TouchableOpacity>
			<View style={{ height: "10%" }} />
			<Image
				style={{ width: 150, height: 150, marginVertical: 15 }}
				resizeMode="contain"
				source={require("../../assets/otp.png")}
			/>
			<Text
				style={{
					color: "#fff",
					fontSize: 30,
					fontWeight: "bold",
					marginVertical: 15,
					letterSpacing: 1,
				}}
			>
				Verification Code
			</Text>
			<Text
				style={{
					color: "#fff",
					width: "60%",
					textAlign: "center",
					fontSize: 18,
					letterSpacing: 1,
				}}
			>
				Enter the verification code send to the number{" "}
				<Text style={{ fontWeight: "bold" }}> (+91){phoneNumber}</Text>
			</Text>

			<OTPInputView
				style={{ width: "60%", height: "15%" }}
				pinCount={4}
				code={code}
				onCodeChanged={(code) => setCode(code)}
				autoFocusOnLoad
				codeInputFieldStyle={styles.underlineStyleBase}
				codeInputHighlightStyle={styles.underlineStyleHighLighted}
				onCodeFilled={(code) => {
					console.log(`Code is ${code}, you are good to go!`);
				}}
			/>
			<View style={{ height: "10%" }} />
			<Button
				mode="contained"
				uppercase={false}
				style={{ borderRadius: 15, width: "70%" }}
				contentStyle={{ padding: 10 }}
				labelStyle={{ fontSize: 20 }}
				onPress={() => verificationHandler()}
			>
				Submit
			</Button>
			{canSendOtp && (
				<TouchableOpacity onPress={resendOtp}>
					<Text
						style={{
							marginTop: 12,
							color: "#fff",

							textAlign: "center",
							fontSize: 18,
							letterSpacing: 1,
						}}
					>
						Resend OTP
					</Text>
				</TouchableOpacity>
			)}
			{!canSendOtp && (
				<View style={{ flexDirection: "row", justifyContent: "center" }}>
					<Text
						style={{
							marginTop: 12,
							color: "#fff",
							// width: "60%",
							textAlign: "center",
							fontSize: 18,
							letterSpacing: 1,
						}}
					>
						Resend OTP in {"  "}
					</Text>

					<CountDown
						until={30}
						size={18}
						onFinish={() => setCanSendOtp(true)}
						style={{ width: 30 }}
						digitStyle={{ backgroundColor: "transparent", margin: 0 }}
						digitTxtStyle={{ color: Colors.primary }}
						timeToShow={["S"]}
						timeLabels={{ s: "SS" }}
					/>
					<Text
						style={{
							marginTop: 12,
							color: "#fff",
							textAlign: "center",
							fontSize: 18,
							letterSpacing: 1,
						}}
					>
						seconds
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		alignItems: "center",
	},
	borderStyleBase: {
		width: 30,
		height: 45,
	},

	borderStyleHighLighted: {
		borderColor: "#03DAC6",
	},

	underlineStyleBase: {
		width: 55,
		height: 45,
		borderWidth: 0,
		fontSize: 24,
		borderBottomWidth: 1,
	},

	underlineStyleHighLighted: {
		borderColor: Colors.primary,
	},
});
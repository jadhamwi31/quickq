import { useState } from "react";

import { useAuthContext } from "../context/AuthContext";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);

	const { loggedIn } = useAuthContext();

	const login = async (username, password) => {
		setIsLoading(true);
		setError(null);

		const response = await fetch("auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const json = await response.json();

		if (!response.ok) {
			setIsLoading(false);
			setError(json.message);
		}
		if (response.ok) {
			loggedIn();

			// update loading state
			setIsLoading(false);
		}
	};

	return { login, isLoading, error };
};

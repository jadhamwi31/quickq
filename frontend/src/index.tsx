import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MenuStylesContextProvider } from "./context/menuStylesContext";
import { CategoriesContextProvider } from "./context/categoriesContext";
import { TabelContextProvider } from "./context/tableContext";
import { ActiveMenuContextProvider } from "./context/ActiveMenuContext";
import { OrderContextProvider } from "./context/orderContext";
import { SocketIoContextProvider } from "./context/SocketIoContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<AuthContextProvider>
			<OrderContextProvider>
				<ActiveMenuContextProvider>
					<MenuStylesContextProvider>
						<TabelContextProvider>
							<CategoriesContextProvider>
								<SocketIoContextProvider>
									<App />
								</SocketIoContextProvider>
							</CategoriesContextProvider>
						</TabelContextProvider>
					</MenuStylesContextProvider>
				</ActiveMenuContextProvider>
			</OrderContextProvider>
		</AuthContextProvider>
	</React.StrictMode>
);

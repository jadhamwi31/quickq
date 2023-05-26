import { MenuCategoriesOrderType } from "../types/menu.types";

export interface IMenu {
	header: {
		styles: IMenuHeaderStyles;
	};
	body: {
		categoriesOrder: MenuCategoriesOrderType;
		styles: IMenuBodyStyles;
	};
}

export interface IMenuHeaderStyles {
	bgColor: string;
	left: string;
	right: string;
}

export interface IMenuBodyStyles {
	color: string;
	bgColor: string;
}

import { CSSProperties } from "react";
import { MenuCategoriesOrder } from "../types/menu.types";

export interface IMenuCustomization {
	name: string;
	body: Partial<CSSProperties>;
	item: Partial<CSSProperties>;
	category: Partial<CSSProperties>;
	categories_order?: MenuCategoriesOrder;
}

export interface IMenuCustomizationReformed extends IMenuCustomization {
	active: boolean;
}

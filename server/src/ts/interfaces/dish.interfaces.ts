export interface IDishIngredient {
	name: string;
	amount: number;
}

export interface IDish {
	name: string;
	price: number;
	description: string;
	ingredients: IDishIngredient[];
	category: string;
	image?: string;
}

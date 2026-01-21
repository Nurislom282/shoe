export interface ProductStock {
	total: number;
	sizes: Array<{ size: number; count: number }>;
}
export interface ProductImage {
	url: string;
}

export interface Product {
	_id: string;
	category: string;
	status: string;
	name: string;
	brand: string;
	price: number;
	discountPrice?: number;
	currency: string;
	gender: string[];
	season: string;
	productViews: number;
	productLikes: number;
	productRank: number;
	rating?: number;
	reviewsCount?: number;
	images: ProductImage[];
	colors: string[];
	stock: ProductStock;
	specifications?: {
		material?: string;
		weight?: string;
		origin?: string;
	};
	description: string;
	memberId: string;
	soldAt?: string;
	createdAt: string;
	updatedAt: string;
	meLiked?: any; // Define MeLiked interface if needed, or use any for now
	memberData?: any;
}

export interface Products {
	list: Product[];
	metaCounter: Array<{ total: number }>;
}

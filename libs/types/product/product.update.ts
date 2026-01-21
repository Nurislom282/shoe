import { ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	category?: string;
	status?: string;
	name?: string;
	price?: number;
	discountPrice?: number;
	currency?: string;
	brand?: string;
	gender?: string[];
	season?: string;
	images?: string[];
	colors?: string[];
	stock?: any;
	description?: string;
	soldAt?: Date;
}

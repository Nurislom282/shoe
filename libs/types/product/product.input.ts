import { ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	category: string;
	status?: string;
	name: string;
	price: number;
	discountPrice?: number;
	currency?: string;
	brand?: string;
	gender?: string[];
	season?: string;
	images: string[]; // Keeping as string[] for upload results, or should it be ProductImage[]? User's AddProduct uses string[].
	colors?: string[];
	stock?: any; // Simplify for now or define strictly
	description?: string;
	memberId?: string;
	productLocation?: string; // Keep if still needed for legacy or remove? Removing as per query.
	productAddress?: string;
	productSquare?: number;
	productBeds?: number;
	productRooms?: number;
}

interface PISearch {
	memberId?: string;
	locationList?: ProductLocation[];
	typeList?: ProductType[];
	roomsList?: Number[];
	seasons?: string[];
	options?: string[];
	bedsList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface AgentProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productLocationList?: ProductLocation[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}

import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberArticles
				memberPoints
				memberLikes
				memberViews
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBERS_BY_ROLE = gql`
	query GetMembersByRole($memberType: MemberType!, $input: OrdinaryInquiry!) {
		getMembersByRole(memberType: $memberType, input: $input) {
			list {
				_id
				memberType
				memberNick
				memberStatus
				memberAuthType
				memberPhone
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_BLOCKED_MEMBERS = gql`
	query GetBlockedMembers($input: OrdinaryInquiry!) {
		getBlockedMembers(input: $input) {
			list {
				_id
				memberNick
				memberStatus
				memberBlocks
				memberPhone
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_STATS = gql`
	query GetMemberStats {
		getMemberStats {
			totalMembers
			activeMembers
			blockedMembers
			deletedMembers
			totalViews
			totalLikes
			membersByRole {
				_id
				count
			}
		}
	}
`;

export const GET_TOP_MEMBERS = gql`
	query GetTopMembers($limit: Int) {
		getTopMembers(limit: $limit) {
			topManagers {
				_id
				memberNick
				memberType
				memberPoints
				memberImage
			}
			topCustomers {
				_id
				memberNick
				memberType
				memberPoints
				memberImage
			}
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
	query GetAllProductsByAdmin($input: AllProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
			list {
				_id
				category
				status
				name
				price
				discountPrice
				currency
				brand
				productViews
				productLikes
				colors
				stock {
					total
					sizes {
						size
						count
					}
				}
				description
				memberId
				soldAt
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ADMIN_PRODUCT_STATS = gql`
	query GetAdminProductStats {
		getAdminProductStats {
			totalProducts
			activeProducts
			totalStock
			lowStockProducts
			averagePrice
			totalViews
			totalLikes
			topViewedProducts {
				_id
				name
				productViews
				price
				memberId
			}
			topLikedProducts {
				_id
				name
				productLikes
				price
				memberId
			}
			lowStockList {
				_id
				name
				stock {
					total
				}
				price
			}
		}
	}
`;

export const GET_LOW_STOCK_PRODUCTS = gql`
	query GetLowStockProducts {
		getLowStockProducts {
			list {
				_id
				name
				brand
				price
				stock {
					total
					sizes {
						size
						count
					}
				}
			}
		}
	}
`;

export const GET_PRODUCTS_BY_STATUS = gql`
	query GetProductsByStatus($status: String!, $input: OrdinaryInquiry!) {
		getProductsByStatus(status: $status, input: $input) {
			list {
				_id
				name
				status
				brand
				price
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_PRODUCT_SALES_REPORT = gql`
	query GetProductSalesReport($input: OrdinaryInquiry!) {
		getProductSalesReport(input: $input) {
			list {
				_id
				name
				soldAt
				price
				memberId
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
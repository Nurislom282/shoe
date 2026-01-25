import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const BLOCK_MEMBER = gql`
	mutation BlockMember($memberId: String!) {
		blockMember(memberId: $memberId) {
			_id
			memberStatus
			memberBlocks
		}
	}
`;

export const UNBLOCK_MEMBER = gql`
	mutation UnblockMember($memberId: String!) {
		unblockMember(memberId: $memberId) {
			_id
			memberStatus
			memberBlocks
		}
	}
`;

export const BULK_UPDATE_MEMBER_STATUS = gql`
	mutation BulkUpdateMemberStatus($input: BulkMemberStatusUpdate!) {
		bulkUpdateMemberStatus(input: $input) {
			message
			affectedCount
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
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
			images {
				url
			}
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
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($productId: String!) {
		removeProductByAdmin(productId: $productId) {
			_id
			name
			status
		}
	}
`;

export const BULK_UPDATE_PRODUCT_STATUS = gql`
	mutation BulkUpdateProductStatus($input: BulkProductStatusUpdate!) {
		bulkUpdateProductStatus(input: $input) {
			message
			affectedCount
		}
	}
`;

export const RESET_PRODUCT_STATS = gql`
	mutation ResetProductStats($productId: String!) {
		resetProductStats(productId: $productId) {
			_id
			name
			productViews
			productLikes
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($articleId: String!) {
		removeBoardArticleByAdmin(articleId: $articleId) {
			_id
			articleTitle
			articleStatus
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($commentId: String!) {
		removeCommentByAdmin(CommentId: $commentId) {
			_id
			commentStatus
			commentGroup
			commentContent
		}
	}
`;
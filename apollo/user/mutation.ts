import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
			memberPoints
			memberLikes
			memberViews

			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
			memberGmail
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks

			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
			memberPoints
			memberLikes
			memberViews

			createdAt
			updatedAt
		}
	}
`;

export const REQUEST_PASSWORD_RESET = gql`
	mutation RequestPasswordReset($email: String!) {
		requestPasswordReset(email: $email)
	}
`;

export const VERIFY_RESET_CODE = gql`
	mutation VerifyResetCode($email: String!, $code: String!) {
		verifyResetCode(email: $email, code: $code)
	}
`;

export const RESET_PASSWORD = gql`
	mutation ResetPassword($email: String!, $code: String!, $newPassword: String!) {
		resetPassword(email: $email, code: $code, newPassword: $newPassword)
	}
`;

/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			_id
			name
			season
			brand
			price
			category
			stock {
				total
				sizes {
					size
					count
				}
			}
			images {
				url
			}
			status
			createdAt
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
			_id
			category
			status
			name
			brand
			price
			discountPrice
			currency
			stock {
				total
				sizes {
					size
					count
				}
			}
			images {
				url
			}
			colors
			description
			season
			productViews
			productLikes
			productRank
			memberId
			soldAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
			_id
			category
			status
			name
			brand
			price
			discountPrice
			currency
			stock {
				total
				sizes {
					size
					count
				}
			}
			images {
				url
			}
			colors
			description
			season
			productViews
			productLikes
			productRank
			memberId
			soldAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      SUPPORT INQUIRY    *
 *************************/

export const CREATE_SUPPORT_INQUIRY = gql`
	mutation CreateSupportInquiry($input: SupportInquiryInput!) {
		createSupportInquiry(input: $input) {
			_id
			inquiryContent
			memberId
			inquiryStatus
			adminResponse
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         IMAGE          *
 *************************/

export const UPLOAD_IMAGE = gql`
	mutation ImageUploader($file: Upload!, $target: String!) {
		imageUploader(file: $file, target: $target)
	}
`;

export const UPLOAD_IMAGES = gql`
	mutation ImagesUploader($files: [Upload!]!, $target: String!) {
		imagesUploader(files: $files, target: $target)
	}
`;
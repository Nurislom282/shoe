# Backend Data Specification - ShoeZ Project

This document outlines the data structures, GraphQL schema, and logic required on the backend to support the entire application, including Shop, Community, Authentication, and Profile features.

---

## 1. Member Module (Authentication & Users)

### Goals
Handle user registration, login, profile management, and retrieving agent lists.

### Schema
#### Mutations
- **signup(input: MemberInput!): Member!**
    - Creates a new member.
    - Hashes password.
    - Generates JWT token (`accessToken`).
- **login(input: LoginInput!): Member!**
    - Verifies credentials.
    - Returns member data with `accessToken`.
- **updateMember(input: MemberUpdate!): Member!**
    - Private access.
    - Updates profile info.
- **likeTargetMember(memberId: String!): Member!**
    - Toggles like status for a member.

#### Queries
- **getAgents(input: AgentsInquiry!): Agents!**
    - Returns a paginated list of members with `memberType = AGENT`.
- **getMember(memberId: String!): Member!**
    - Returns public profile data for a specific member.

### Input Types
```graphql
input MemberInput {
    memberNick: String!
    memberPassword: String!
    memberPhone: String!
    memberType: String # "USER" or "AGENT"
}

input AgentsInquiry {
    page: Int!
    limit: Int!
    search: AISearch
}
```

---

## 2. Product Module (Shop)

### Goals
Manage product listings, searching, filtering, and liking.

### Schema
#### Mutations
- **createProduct(input: ProductInput!): Product!**
    - Private access (Agents only).
- **updateProduct(input: ProductUpdate!): Product!**
    - Owner access only.
- **likeTargetProduct(productId: String!): Product!**
    - Toggles like status.

#### Queries
- **getProduct(productId: String!): Product!**
    - Returns single product detail.
    - Populates `memberData`.
- **getProducts(input: ProductsInquiry!): Products!**
    - Main shop query.
    - Supports complex filtering (see Logic below).
- **getAgentProducts(input: AgentProductsInquiry!): Products!**
    - Returns products for a specific agent/member.
- **getFavorites(input: OrdinaryInquiry!): Products!**
    - Returns products liked by the current user.
- **getVisited(input: OrdinaryInquiry!): Products!**
    - Returns formatted list of recently visited products.

### Filter Logic (getProducts)
The `search` input in `ProductsInquiry` determines the filters:
1.  **Text Search**: Regex match on Title/Description.
2.  **Category (`typeList`)**: Match `productType` against list (e.g., `['SNEAKER', 'BOOT']`).
3.  **Price Range (`pricesRange`)**: `start` <= `productPrice` <= `end`.
4.  **Seasons (`seasons`)**: Match product season (e.g., `['SUMMER']`).
5.  **Sale (`options`)**: If `options` contains "sale", filter active promotions.

---

## 3. Board Article Module (Community)

### Goals
Manage community posts/articles.

### Schema
#### Mutations
- **createBoardArticle(input: BoardArticleInput!): BoardArticle!**
    - Private access.
- **updateBoardArticle(input: BoardArticleUpdate!): BoardArticle!**
    - Owner access only.
- **likeTargetBoardArticle(articleId: String!): BoardArticle!**
    - Toggles like status.

#### Queries
- **getBoardArticle(articleId: String!): BoardArticle!**
    - Returns single article detail.
- **getBoardArticles(input: BoardArticlesInquiry!): BoardArticles!**
    - Returns paginated list.
    - Filters by `articleCategory` (FREE, NEWS, RECOMMEND, HUMOR).

---

## 4. Comment Module

### Goals
Handle comments on products and articles.

### Schema
#### Mutations
- **createComment(input: CommentInput!): Comment!**
    - Private access.
- **updateComment(input: CommentUpdate!): Comment!**
    - Owner access only.

#### Queries
- **getComments(input: CommentsInquiry!): Comments!**
    - Returns comments for a specific reference ID (`commentRefId`), which can be a Product ID or Article ID.
    - Filter by `commentGroup` (PRODUCT or ARTICLE).

---

## 5. Follow Module

### Goals
Allow users to follow other users/agents.

### Schema
#### Mutations
- **subscribe(input: String!): Subscriber!**
    - Input is `followingId`.
    - Creates a relationship record.
- **unsubscribe(input: String!): Subscriber!**
    - Removes the relationship.

#### Queries
- **getMemberFollowers(input: FollowInquiry!): Followers!**
    - Returns list of people following a user.
- **getMemberFollowings(input: FollowInquiry!): Followings!**
    - Returns list of people a user is following.

---

## 6. Support Module

### Goals
Handle customer support inquiries.

### Schema
#### Mutations
- **createSupportInquiry(input: SupportInquiryInput!): SupportInquiry!**
    - Types: "General", "Payment", "Product".

---

## General Notes for All Modules
1.  **Pagination**: All lists (`list` field) must be accompanied by a `metaCounter` array containing the `total` count for pagination calculation on the frontend.
2.  **Auth Guard**: Mutations and some specific queries (like `getFavorites`) require a valid JWT in the header (`Authorization: Bearer <token>`).
3.  **Timestamps**: All entities should have `createdAt` and `updatedAt`.
4.  **Relationships**:
    - Product/Article -> Member (Author)
    - Comment -> Member (Commenter)
    - Entities typically return populated member data (nick, image) for display.

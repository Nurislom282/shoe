# NestJS Backend API

This README documents the backend API requirements and setup for the NestJS application, focusing on the "Product" module (formerly "Property").

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Product API (Refactored)](#product-api-refactored)
    - [Data Model](#data-model)
    - [GraphQL Queries](#graphql-queries)
- [Running the App](#running-the-app)

## Overview

This is the backend API for the Nestar Next application, built with NestJS. It provides a GraphQL API to serve the frontend application.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB (running locally or cloud instance)

## Installation & Setup

```bash
# Clone the repository (if not already done)
# git clone <repository-url>

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory. **Do not commit this file.**

```env
# Example .env configuration
PORT=3000
MONGO_URI=mongodb://localhost:27017/nestar
JWT_SECRET=your_jwt_secret_key
```

## Product API (Refactored)

> [!IMPORTANT]
> The **Property** module is being refactored to **Product** to align with the shoe shop domain. All "property" related schemas, DTOs, and resolvers must be updated to "product".

### Data Model

The `Product` schema should replace the `Property` schema.

**Key Changes:**
- `Property` -> `Product`
- `propertyTitle` -> `productTitle`
- `propertyPrice` -> `productPrice`
- ...and so on for all `propertyPrefix` fields.

**Interface (TypeScript):**

```typescript
export interface Product {
    _id: string;
    productType: ProductType;
    productStatus: ProductStatus;
    productLocation: ProductLocation;
    productAddress: string;
    productTitle: string;
    productPrice: number;
    productSquare: number; // Consider deprecating if irrelevant for shoes
    productBeds: number;   // Consider deprecating if irrelevant for shoes
    productRooms: number;  // Consider deprecating if irrelevant for shoes
    productViews: number;
    productLikes: number;
    productComments: number;
    productRank: number;
    productImages: string[];
    productDesc?: string;
    memberId: string;
    soldAt?: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

### GraphQL Queries

The following queries must be exposed by the backend to support the frontend:

#### `getProducts`

Retrieves a list of products based on filter criteria.

```graphql
query GetProducts($input: ProductsInquiry!) {
    getProducts(input: $input) {
        list {
            _id
            productTitle
            productPrice
            productImages
            productStatus
            # ... other fields
        }
        metaCounter {
            total
        }
    }
}
```

#### `getProduct`

Retrieves a single product by ID.

```graphql
query GetProduct($input: String!) {
    getProduct(productId: $input) {
        _id
        productTitle
        # ... other fields
    }
}
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

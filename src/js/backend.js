// javascript module that provides a client side interface to the https://v2.api.noroff.dev/ API
// for the Square Eyes movie database

// the backend has the following API:

/*
---
title: Error Structure
description: Learn about the structure of errors returned by the API.
---

<Callout variant="info">
  We are using the Auction House endpoints in these examples. The error structure is the same for all endpoints.
</Callout>

## The error structure

<TypeTable
  type={{
    errors: {
      type: "Array<object>",
      typeDescription: "Array<{\n  code?: string;\n  message: string;\n  path?: Array<string>\n}>",
      description: "The errors"
    },
    "errors[].code?": {
      type: "string",
      description: "The error code. Typically related to validation errors."
    },
    "errors[].message": { type: "string", description: "The error message" },
    "errors[].path?": {
      type: "Array<string>",
      description: "The path of the property that caused the error. Typically related to validation errors."
    },
    status: { type: "string", description: "The HTTP status" },
    statusCode: { type: "number", description: "The HTTP status code" }
  }}
/>

<Hr />

## Examples

Imagine you're trying to get a listing by its ID, but that listing doesn't exist. You will get the following error:

```json title="Example"
{
  "errors": [
    {
      "message": "No listing with such ID"
    }
  ],
  "status": "Not Found",
  "statusCode": 404
}
```

In the above example, the `errors` property is an array of errors. In this case, there is only one error. The `status` property is the HTTP status, and the `statusCode` property is the HTTP status code number.

If the error is a validation error, we will return a more detailed error message. For example, if you try to delete an Auction House listing and the ID is not a valid listing ID (UUID), you will get the following error:

```json title="Validation Error Example"
{
  "errors": [
    {
      "code": "invalid_string",
      "message": "ID must be a valid UUID",
      "path": ["id"]
    }
  ],
  "status": "Not Found",
  "statusCode": 404
}
```

In the above example, the `code` property is the error code, the `message` property is the error message, and the `path` property is the path to the property that caused the error. In this case, the `id` property caused the error.

As an example, you will receive the following error if you are not using the [new Media model](./dirrerences-from-v1#new-media-model) when adding images to the listing:

```json title="Validation Error Example"
{
  "errors": [
    {
      "code": "invalid_type",
      "message": "Expected array, received string",
      "path": ["media"]
    }
  ],
  "status": "Bad Request",
  "statusCode": 400
}
```

<Hr />

## Error Codes

For an explanation of the different response codes and what they mean, see [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
*/

function displayErrors(errors) {
  errors.forEach((error) => {
    console.error(`Error: ${error.message}`);
    if (error.path) {
      console.error(`Path: ${error.path.join(".")}`);
    }
  });
}

/*
---
title: Register
description: Register a new user profile
---

## Register a new user profile

<EndpointDetails method="POST" path="/auth/register" />

You will need to send all of the required values in your `POST` request body.

```json title="Request"
{
  "name": "my_username", // Required
  "email": "first.last@stud.noroff.no", // Required
  "password": "UzI1NiIsInR5cCI", // Required
  "bio": "This is my profile bio", // Optional
  "avatar": {
    "url": "https://img.service.com/avatar.jpg", // Optional
    "alt": "My avatar alt text" // Optional
  },
  "banner": {
    "url": "https://img.service.com/banner.jpg", // Optional
    "alt": "My banner alt text" // Optional
  }
}
```

A successful response will return a `201 Created` status code and the newly created user profile.

```json title="Response"
{
  "data": {
    "name": "my_username",
    "email": "first.last@stud.noroff.no",
    "bio": "This is my profile bio",
    "avatar": {
      "url": "https://img.service.com/avatar.jpg",
      "alt": "My avatar alt text"
    },
    "banner": {
      "url": "https://img.service.com/banner.jpg",
      "alt": "My banner alt text"
    }
  },
  "meta": {}
}
```

### Restrictions

- The `name` value must not contain punctuation symbols apart from underscore (`_`).
- The `email` value must be a valid `stud.noroff.no` email address.
- The `password` value must be at least 8 characters.
- If set, the `bio` value must be less than 160 characters.
- If set, the `avatar.url` value must be a valid and accessible URL.
- If set, the `avatar.alt` value must be less than 120 characters. Defaults to empty string (`""`). Requires `avatar.url` to be set.
- If set, the `banner.url` value must be a valid and accessible URL.
- If set, the `banner.alt` value must be less than 120 characters. Defaults to empty string (`""`). Requires `banner.url` to be set.

### Types

<TypeTable
  type={{
    name: { type: "string", description: "The user's name" },
    email: { type: "string", description: "The user's email address" },
    password: { type: "string", description: "The user's password" },
    bio: { type: "string?", description: "The user's profile bio" },
    avatar: {
      type: "object?",
      typeDescription: "{\n  url: string,\n  alt?: string\n}",
      description: "The user's avatar image"
    },
    banner: {
      type: "object?",
      typeDescription: "{\n  url: string,\n  alt?: string\n}",
      description: "The user's banner image"
    }
  }}
/>
*/
/**
 * Register a user
 * 
 * @param {Object} userData - The user data
 * @param {string} userData.name - The user's name (required)
 * @param {string} userData.email - The user's email address (required)
 * @param {string} userData.password - The user's password (required)
 * @param {string} [userData.bio] - The user's profile bio (optional)
 * @param {Object} [userData.avatar] - The user's avatar image (optional)
 * @param {string} userData.avatar.url - The URL of the avatar image (optional)
 * @param {string} [userData.avatar.alt] - The alt text for the avatar image (optional)
 * @param {Object} [userData.banner] - The user's banner image (optional)
 * @param {string} userData.banner.url - The URL of the banner image (optional)
 * @param {string} [userData.banner.alt] - The alt text for the banner image (optional)
 * @returns {Promise<Object>} The newly created user profile
 */
async function registerUser(userData) {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  
    if (response.ok) {
      return await response.json();
    } else {
        throw await response.json();
    }
}



/*
---
title: Login
description: Login a user
---

## Login a user

<EndpointDetails method="POST" path="/auth/login" />

You can use this endpoint to login a registered user.

```json title="Request"
{
  "email": "first.last@stud.noroff.no",
  "password": "UzI1NiIsInR5cCI"
}
```

A successful response will return a `200 OK` status code and the user profile.

```json title="Response"
{
  "data": {
    "name": "my_username",
    "email": "first.last@stud.noroff.no",
    "avatar": {
      "url": "https://img.service.com/avatar.jpg",
      "alt": "My avatar alt text"
    },
    "banner": {
      "url": "https://img.service.com/banner.jpg",
      "alt": "My banner alt text"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
  },
  "meta": {}
}
```
*/

// Function to login a user
async function login(email, password) {
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
  
    if (response.ok) {
        return await response.json();
      } else {
          throw await response.json();
      }
    }
  
  /*
  ---
  title: API Key
  description: Create and use an API Key to access the Noroff API.
  ---
  
  ## The API Key model
  
  <TypeTable
    type={{
      name: {
        type: "string",
        default: "API Key",
        description: "The API Key name. This really only exists for your own reference."
      },
      status: {
        type: "string",
        default: "ACTIVE",
        description: "The API Key status. Can be either ACTIVE or REVOKED."
      },
      key: {
        type: "string",
        typeDescription: "A UUID v4 string.",
        description: "The API Key."
      }
    }}
  />
  
  ## Create an API Key
  
  <EndpointDetails method="POST" path="/auth/create-api-key" />
  
  You can use this endpoint to create an API Key.
  
  You do not need to provide any data in the request body, but you can optionally provide a `name` value.
  
  ```json title="Request"
  {
    "name": "My API Key name" // Optional
  }
  ```
  
  A successful response will return a `201 Created` status code and the newly created API Key.
  
  ```json title="Request"
  {
    "data": {
      "name": "My API Key name", // Or "API Key" if no name was provided
      "status": "ACTIVE",
      "key": "be4ab55c-d5b0-44c3-8a11-67a7dafddd10" // The API Key
    },
    "meta": {}
  }
  ```
  
  ### Restrictions
  
  - If set, the `name` value must be less than 32 characters.
  
  ### Types
  
  <TypeTable
    type={{
      name: {
        type: "string",
        default: "API Key",
        description: "The API Key name. This really only exists for your own reference."
      }
    }}
  />
  */
  
  // Function to create an API Key
  async function createApiKey(accessToken, name) {
      const response = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
          name: name
          })
      });
      
      if (response.ok) {
          return await response.json();
      } else {
          throw await response.json();
      }
  }
  


  /*
  
  ## Using the API Key
  
  You use the API Key by sending it in the `X-Noroff-API-Key` header, along with the access token of the requesting user.
  
  ```js
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey
    }
  }
  
  const response = await fetch(`${NOROFF_API_URL}/social/posts`, options)
  const data = await response.json()
  ```
  */
  
  
  
  /* 
  ---
  title: Square Eyes
  ---
  
  These endpoints allow you to retrieve all products, or a single product by its id. The response will be an array of JSON objects if you request all products, or a single JSON object if you request a single product.
  
  ## The Square Eyes model
  
  <TypeTable
    type={{
      id: { type: "string", description: "The id of the product." },
      title: { type: "string", description: "The title of the product." },
      description: { type: "string", description: "The description of the product." },
      genre: { type: "string", description: "The genre of the product." },
      rating: { type: "string", description: "The rating of the product." },
      released: { type: "string", description: "The release date of the product." },
      price: { type: "float", description: "The price of the product." },
      discountedPrice: { type: "float", description: "The discounted price of the product." },
      onSale: { type: "boolean", description: "Whether the product is on sale or not." },
      image: { type: "object", typeDescription: "Instance of `Media` model.", description: "The image of the product." },
      tags: { type: "Array<string>", description: "A string array of the tags of the product." },
      favorite: { type: "boolean", description: "Whether the product is a favorite or not." }
    }}
  />
  
  <Hr />
  
  ## All products
  
  <EndpointDetails path="/square-eyes" />
  
  Retrieve all products.
  
  ```json title="Response"
  {
    "data": [
      {
        "id": "352ba432-5b5d-4ccc-9aba-f2704c500cf3",
        "title": "Hobbs & Shaw",
        "description": "Lawman Luke Hobbs (Dwayne 'The Rock' Johnson) and outcast Deckard Shaw (Jason Statham) form an unlikely alliance when a cyber-genetically enhanced villain threatens the future of humanity.",
        "genre": "Action",
        "rating": "6.5",
        "released": "2019",
        "price": 129.99,
        "discountedPrice": 119.99,
        "onSale": true,
        "image": {
          "url": "https://static.cloud.noroff.dev/api/square-eyes/0-hobbs-and-shaw.jpg",
          "alt": "A movie poster for the film Hobbs & Shaw"
        },
        "tags": ["gamehub", "game"],
        "favorite": true
      },
      {
        "id": "4696b9e6-ec6e-4672-a08d-3e3212a215c8",
        "title": "Godzilla: King of the Monsters",
        "description": "The crypto-zoological agency Monarch faces off against a battery of god-sized monsters, including the mighty Godzilla, who collides with Mothra, Rodan, and his ultimate nemesis, the three-headed King Ghidorah.",
        "genre": "Action",
        "rating": "9",
        "released": "2019",
        "price": 109.99,
        "discountedPrice": 109.99,
        "onSale": false,
        "image": {
          "url": "https://static.cloud.noroff.dev/api/square-eyes/1-godzilla-king-of-monsters.jpg",
          "alt": "A movie poster for the film Godzilla: King of the Monsters"
        },
        "tags": ["gamehub", "game"],
        "favorite": true
      }
      // ...
    ],
    "meta": {
      "isFirstPage": true,
      "isLastPage": true,
      "currentPage": 1,
      "previousPage": null,
      "nextPage": null,
      "pageCount": 1,
      "totalCount": 2
    }
  }
  ```
  
  <Hr />
  
  ## Single product
  
  <EndpointDetails path="/square-eyes/<id>" />
  
  Retrieve a single product by its id.
  
  ```json title="Response"
  {
    "data": {
      "id": "352ba432-5b5d-4ccc-9aba-f2704c500cf3",
      "title": "Hobbs & Shaw",
      "description": "Lawman Luke Hobbs (Dwayne 'The Rock' Johnson) and outcast Deckard Shaw (Jason Statham) form an unlikely alliance when a cyber-genetically enhanced villain threatens the future of humanity.",
      "genre": "Action",
      "rating": "6.5",
      "released": "2019",
      "price": 129.99,
      "discountedPrice": 119.99,
      "onSale": true,
      "image": {
        "url": "https://static.cloud.noroff.dev/api/square-eyes/0-hobbs-and-shaw.jpg",
        "alt": "A movie poster for the film Hobbs & Shaw"
      },
      "tags": ["gamehub", "game"],
      "favorite": true
    },
    "meta": {}
  }
  ```
  */
  
  const fetchData = async (path, options) => {
    const response = await fetch("https://v2.api.noroff.dev" + path, options);
    if (response.ok) {
        return await response.json();
    } else {
        throw await response.json();
    }
};
  
  const getAllProducts = async (options) => {
    const url = '/square-eyes';
    const data = await fetchData(url, options);
    return data.data;
  };
  
  const getProductById = async (id, options) => {
    const url = `/square-eyes/${id}`;
    const data = await fetchData(url, options);
    return data.data;
  };
  
  

  // Register my account

  

const userData = {
    name: "Rosario_Bustillo",
    email: "marbus22891@stud.noroff.no",
    password: "O0f56%ZiE9J",
    bio: "This is my profile bio. I am a student at Noroff. I am a human. I am a person. I am me. I am Rosario.",
    avatar: {
      url: "https://avatars.githubusercontent.com/u/146356539?v=4",
      alt: "Avatar alt text"
    },
    banner: {
      url: "https://avatars.githubusercontent.com/u/146356539?v=4",
      alt: "Banner alt text"
    }
  };

  // done once
/*
registerUser(userData).then(data => {     
    console.log(data);
}).catch(error => {
    displayErrors(error['errors']);
});
*/

/*
{"data":{"name":"Rosario_Bustillo","email":"marbus22891@stud.noroff.no","bio":"This is my profile bio. I am a student at Noroff. I am a human. I am a person. I am me. I am Rosario.","avatar":{"url":"https://avatars.githubusercontent.com/u/146356539?v=4","alt":"Avatar alt text"},"banner":{"url":"https://avatars.githubusercontent.com/u/146356539?v=4","alt":"Banner alt text"}},"meta":{}}
*/

// done once

  /*
  login(userData['email'], userData['password']).then(data => {
    console.log(data);
  }).catch(error => {
    displayErrors(error['errors']);
  });
*/

loginResult = {"data":{"name":"Rosario_Bustillo","email":"marbus22891@stud.noroff.no","bio":"This is my profile bio. I am a student at Noroff. I am a human. I am a person. I am me. I am Rosario.","avatar":{"url":"https://avatars.githubusercontent.com/u/146356539?v=4","alt":"Avatar alt text"},"banner":{"url":"https://avatars.githubusercontent.com/u/146356539?v=4","alt":"Banner alt text"},"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM2LCJuYW1lIjoiUm9zYXJpb19CdXN0aWxsbyIsImVtYWlsIjoibWFyYnVzMjI4OTFAc3R1ZC5ub3JvZmYubm8iLCJiaW8iOiJUaGlzIGlzIG15IHByb2ZpbGUgYmlvLiBJIGFtIGEgc3R1ZGVudCBhdCBOb3JvZmYuIEkgYW0gYSBodW1hbi4gSSBhbSBhIHBlcnNvbi4gSSBhbSBtZS4gSSBhbSBSb3NhcmlvLiIsImNyZWF0ZWQiOiIyMDI0LTAyLTI0VDIwOjUxOjUwLjQxMVoiLCJ1cGRhdGVkIjoiMjAyNC0wMi0yNFQyMDo1MTo1MC40MTFaIiwiY3JlZGl0cyI6MTAwMCwidmVudWVNYW5hZ2VyIjpmYWxzZSwiYXZhdGFyIjp7ImlkIjoiZDAyZTgzYzUtNzY4Mi00YjliLWI2ODgtZmI3ZmIyYzdhNWM0IiwidXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE0NjM1NjUzOT92PTQiLCJhbHQiOiJBdmF0YXIgYWx0IHRleHQiLCJzb2NpYWxQb3N0SWQiOm51bGwsImF1Y3Rpb25MaXN0aW5nSWQiOm51bGwsImhvbGlkYXplVmVudWVJZCI6bnVsbCwidXNlckF2YXRhcklkIjozMzYsInVzZXJCYW5uZXJJZCI6bnVsbCwiYm9va0lkIjpudWxsLCJvbGRHYW1lSWQiOm51bGwsIm9ubGluZVNob3BQcm9kdWN0SWQiOm51bGwsInJhaW55RGF5c1Byb2R1Y3RJZCI6bnVsbCwiZ2FtZUh1YlByb2R1Y3RJZCI6bnVsbCwic3F1YXJlRXllc1Byb2R1Y3RJZCI6bnVsbH0sImJhbm5lciI6eyJpZCI6IjY4ZTE3ZDFkLTM0NmItNDlmYy1iYTg4LTRjZTVmZDczODMzYiIsInVybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNDYzNTY1Mzk_dj00IiwiYWx0IjoiQmFubmVyIGFsdCB0ZXh0Iiwic29jaWFsUG9zdElkIjpudWxsLCJhdWN0aW9uTGlzdGluZ0lkIjpudWxsLCJob2xpZGF6ZVZlbnVlSWQiOm51bGwsInVzZXJBdmF0YXJJZCI6bnVsbCwidXNlckJhbm5lcklkIjozMzYsImJvb2tJZCI6bnVsbCwib2xkR2FtZUlkIjpudWxsLCJvbmxpbmVTaG9wUHJvZHVjdElkIjpudWxsLCJyYWlueURheXNQcm9kdWN0SWQiOm51bGwsImdhbWVIdWJQcm9kdWN0SWQiOm51bGwsInNxdWFyZUV5ZXNQcm9kdWN0SWQiOm51bGx9LCJpYXQiOjE3MDg4MDgwMTd9.QNbNmUbkCqRXaUjE8A3L4OB9mpVLustvEVqgOvd-jqU"},"meta":{}}
/*
createApiKey(loginResult['data']['accessToken'], "Rosario's API Key").then(data => {
    console.log(data);
}).catch(error => {
    displayErrors(error['errors']);
}   );  

*/

apiKeyResult = {"data":{"name":"Rosario's API Key","status":"ACTIVE","key":"778c5127-4f7c-4d4b-9dfe-b4595d781f94"},"meta":{}}

accessToken = loginResult['data']['accessToken'];
apiKey = apiKeyResult['data']['key'];

const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey
    }
  }

// test code
/*
getAllProducts(options).then(data => {
    console.log(data);

    data.forEach(movie => {
        console.log("Fetching information about " + movie.title);

        getProductById(movie.id, options).then(data => {
            console.log(data);
        }).catch(error => {
            displayErrors(error['errors']);
        });
    })
}).catch(error => {
    console.error(error);
});
*/
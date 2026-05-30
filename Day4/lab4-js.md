# Lab 4: Authentication & Authorization

### 10. Update User Routes

**Tasks:**
- Remove the `POST /users` route (create user)
- Add `POST /users/sign-up` route (public, no authentication required)
  - Apply validation middleware with `signUpSchema`
  - Map to `usersController.signUp`
- Add `POST /users/sign-in` route (public, no authentication required)
  - Apply validation middleware with `signInSchema`
  - Map to `usersController.signIn`
- Protect `GET /users` route with `authenticate` middleware and `restrictTo(['admin'])`
- Apply authentication and admin restriction to other user management routes:
  - `GET /users/:id` - requires `authenticate` and `restrictTo(['admin'])`
  - `PATCH /users/:id` - requires `authenticate`, `restrictTo(['admin'])`, and validation
  - `DELETE /users/:id` - requires `authenticate` and `restrictTo(['admin'])`

---

### 11. Update Post Service

**Tasks:**
- Update `createPost` function to accept `userId` parameter and include it in the post data when creating
- Update `getAllPosts` function:
  - Accept `userId` parameter
  - Populate `userId` field with user data (name and email)
  - Add `isOwner` boolean flag to each post indicating if it belongs to the authenticated user
  - Convert posts to objects and compare `post.userId._id` (when populated) with authenticated `userId`
- Update `getPostById` function:
  - Accept `userId` parameter
  - Populate `userId` field with user data (name and email)
  - Add `isOwner` boolean flag to the post
  - Convert post to object and compare `post.userId._id` (when populated) with authenticated `userId`
- Update `updatePostById` function:
  - Accept `userId` parameter
  - Check if the post exists (return `null` if not found)
  - Check if the user is the author by comparing `post.userId` with `userId`
  - Throw `APIError` with status 403 if user is not the author
  - Update and return the post if user is authorized
- Update `deletePostById` function:
  - Accept `userId` parameter
  - Check if the post exists (return `null` if not found)
  - Check if the user is the author by comparing `post.userId` with `userId`
  - Throw `APIError` with status 403 if user is not the author
  - Delete and return the post if user is authorized
- **Important:** Services should check ownership and throw `APIError` for authorization errors, but return `null` for "not found" cases

---

### 12. Update Post Controller

**Tasks:**
- Update `createPost` to use `req.user.userId` from authentication middleware and pass it to service
- Update `getAllPosts` to pass `req.user.userId` to service (for ownership flag)
- Update `getPostById` to pass `req.user.userId` to service (for ownership flag)
- Update `updatePostById` to pass `req.user.userId` to service
- Update `deletePostById` to pass `req.user.userId` to service
- Handle "not found" cases by throwing `APIError` with status 404 when service returns `null`
- Ensure all post routes require authentication (handled in routes, not controller)

---

### 13. Update Post Routes

**Tasks:**
- Add `authenticate` middleware to ALL post routes:
  - `POST /posts` - create post (with validation)
  - `GET /posts` - get all posts (with validation for query params)
  - `GET /posts/:id` - get post by ID
  - `PATCH /posts/:id` - update post (with validation)
  - `DELETE /posts/:id` - delete post
- Ensure `authenticate` middleware runs before validation and controller functions
- All routes should be protected - no public post routes
---
## Submission Checklist

- [ ] All dependencies installed (`bcrypt`, `jsonwebtoken`)
- [ ] `JWT_SECRET` added to `.env` file
- [ ] Post model updated with `userId` field (ObjectId reference to User)
- [ ] `authenticate` middleware created and working
- [ ] `restrictTo` middleware created and working
- [ ] User service updated:
  - [ ] `signUp` function implemented with password hashing
  - [ ] `signIn` function implemented with password comparison and JWT generation
  - [ ] `createUser` function removed
- [ ] User controller updated:
  - [ ] `signUp` controller implemented
  - [ ] `signIn` controller implemented
  - [ ] `createUser` controller removed
- [ ] Sign-up and sign-in schemas created
- [ ] User routes updated:
  - [ ] `POST /users/sign-up` route added (public)
  - [ ] `POST /users/sign-in` route added (public)
  - [ ] `POST /users` route removed
  - [ ] User management routes protected with `authenticate` and `restrictTo(['admin'])`
- [ ] Post service updated:
  - [ ] `createPost` accepts and uses `userId`
  - [ ] `getAllPosts` accepts `userId` and adds `isOwner` flag to each post
  - [ ] `getPostById` accepts `userId` and adds `isOwner` flag
  - [ ] `updatePostById` checks ownership
  - [ ] `deletePostById` checks ownership
- [ ] Post controller updated to use `req.user.userId` and pass it to service functions
- [ ] Post routes protected with `authenticate` middleware
- [ ] All endpoints tested:
  - [ ] Sign up and sign in working
  - [ ] Protected routes require authentication
  - [ ] Admin routes restricted to admin users
  - [ ] Post ownership checks working (can only update/delete own posts)
  - [ ] Error handling working correctly

---

## Tips

- **Password Hashing:** Always use `bcrypt.hash()` with salt rounds of 10 - 12
- **Token Expiration:** Set appropriate expiration times (1 hour is good for this lab)
- **Error Messages:** Use generic error messages for authentication failures ("Invalid email or password") to prevent user enumeration
- **Testing:** Use Postman or Thunder Client to easily manage tokens in headers
- **Authorization:** Remember that authentication (who you are) is different from authorization (what you can do)
- **Ownership Checks:** Always verify ownership in the service layer, not just the controller

---

Good luck! 🚀

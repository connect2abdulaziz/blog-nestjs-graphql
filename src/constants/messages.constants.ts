// src/constants/messages.constants.ts

export const SuccessMessages = {
  USER_REGISTERED_SUCCESS: 'User registered successfully. Please verify your email.',
  EMAIL_VERIFIED_SUCCESS: 'Email verified successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful.',


  //USER_SUCCESS
  USER_LIST_SUCCESS: 'User list retrieved successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_CREATED: 'User created successfully.',
  USER_FOUND: 'User retrieved successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_UPDATED_PROFILE_IMAGE: 'Profile image updated successfully.',
  USER_UPDATED_PASSWORD: 'Password updated successfully.',

  // POST_SUCCESS
  POST_CREATED: 'Post created successfully.',
  POST_UPDATED: 'Post updated successfully.',
  POST_DELETED: 'Post deleted successfully.',
  POST_FOUND: 'Post found successfully.',
  POST_LIST_SUCCESS: 'Posts fetched successfully.',
  USER_POSTS_LIST_SUCCESS: 'User posts fetched successfully.',

  // COMMENT_SUCCESS
  COMMENT_LIST_SUCCESS: 'Comments retrieved successfully.',
  COMMENT_FOUND: 'Comment found successfully.',
  COMMENT_CREATED: 'Comment created successfully.',
  COMMENT_UPDATED: 'Comment updated successfully.',
  COMMENT_DELETED: 'Comment deleted successfully.',
};


export const ErrorMessages = {
  EMAIL_ALREADY_EXISTS: 'This email is already registered.',
  INVALID_VERIFICATION_TOKEN: 'The verification token is invalid.',
  USER_ALREADY_VERIFIED: 'User is already verified.',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password.',
  EMAIL_NOT_VERIFIED: 'Email has not been verified yet.',
  EMAIL_NOT_FOUND: 'Email not found.',
  INVALID_TOKEN: 'The provided token is invalid.',
  TOKEN_EXPIRED: 'The token has expired.',
  UNAUTHORIZED_ACTION: 'You are not authorized to perform this action.',

  POST_NOT_FOUND: 'Post not found.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
  POST_ID_MISSING: 'Post ID missing.',
  POST_UPDATE_MISSING: 'Post update missing information',

  USER_NOT_FOUND: 'User not found.',
  COMMENT_NOT_FOUND: 'Comment not found.',
  USER_NOT_AUTHORIZED: 'You are not authorized to perform this action.',
  PASSWORD_NOT_UPDATED: 'Password not updated.',
  PROFILE_IMAGE_NOT_UPDATED: 'Profile image not updated.',
};


// src/constants/email-messages.constants.ts

export const EmailMessages = {
  VERIFY_EMAIL_SUBJECT: 'Verify Your Email Address',
  VERIFY_EMAIL_BODY: (link: string) => `
    <p>Thank you for registering! Click the following link to verify your email:</p>
    <a href="${link}">${link}</a>
  `,
  EMAIL_SENT_SUCCESS: (email: string) => `Verification email sent to ${email}`,
  EMAIL_SEND_ERROR: 'Failed to send verification email',

  RESET_PASSWORD_SUBJECT: 'Reset Password',
  RESET_PASSWORD_BODY: (link: string) => `
    <p>You have requested a password reset. Click the following link to reset your password:</p>
    <a href="${link}">${link}</a>
  `,

};


export const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  // Add more as needed
};
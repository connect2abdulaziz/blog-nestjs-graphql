// src/constants/messages.constants.ts

export const SuccessMessages = {
  LOGIN_SUCCESS: 'Login successful.',
  SIGNUP_SUCCESS: 'Signup successful.',
  VERIFICATION_SUCCESS: 'Verification successful.',
  EMAIL_VERIFICATION_SENT: 'Verification email sent.',
  LOGOUT_SUCCESS: 'Logout successful.',
  FORGOT_SUCCESS: 'Password reset link sent.',
  RESET_SUCCESS: 'Password reset successful',


  //USER_SUCCESS
  USER_LIST_SUCCESS: 'User list retrieved successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_CREATED: 'User created successfully.',
  USER_FOUND: 'User retrieved successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_UPDATED_PROFILE_IMAGE: 'Profile image updated successfully.',
  USER_UPDATED_PASSWORD: 'Password updated successfully.',

  // POST_SUCCESS
  POST_RETRIEVED: 'Post retrieved successfully.',
  COMMENT_ADDED: 'Comment added successfully.',
  DATA_UPDATED: 'Data updated successfully.',
  DATA_DELETED: 'Data deleted successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  ITEM_CREATED: 'Item created successfully.',
  ITEM_RETRIEVED: 'Item retrieved successfully.',
};


export const ErrorMessages = {
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  INVALID_VERIFICATION_TOKEN: 'Invalid verification token.',
  USER_ALREADY_VERIFIED: 'User is already verified.',
  EMAIL_NOT_VERIFIED: 'Email not verified. A verification link has been sent to your email.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  EMAIL_NOT_FOUND: 'Email not found.',
  INVALID_TOKEN: 'Invalid verification token.',
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

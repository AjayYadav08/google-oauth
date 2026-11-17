// In-memory user database for demonstration
const users = [];

/**
 * Find user by internal ID
 * @param {string} id
 */
const findById = (id) => {
  return users.find((user) => user.id === id);
};

/**
 * Find user by Google ID
 * @param {string} googleId
 */
const findByGoogleId = (googleId) => {
  return users.find((user) => user.googleId === googleId);
};

/**
 * Find existing user by Google ID or create a new user record
 * @param {object} profile - Google OAuth profile object
 */
const findOrCreateGoogleUser = (profile) => {
  let user = findByGoogleId(profile.id);

  if (!user) {
    user = {
      id: profile.id,
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
      photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      createdAt: new Date().toISOString()
    };
    users.push(user);
  }

  return user;
};

module.exports = {
  users,
  findById,
  findByGoogleId,
  findOrCreateGoogleUser
};

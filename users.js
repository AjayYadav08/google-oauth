const users = new Map();

function findOrCreateGoogleUser(profile) {
    const googleId = profile.id;

    let user = users.get(googleId);

    if (!user) {
        user = {
            id: googleId,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            picture: profile.photos?.[0]?.value || null
        };

        users.set(googleId, user);
    }

    return user;
}

function findUserById(id) {
    return users.get(id) || null;
}

module.exports = {
    findOrCreateGoogleUser,
    findUserById
};

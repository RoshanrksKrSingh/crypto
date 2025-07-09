const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const isStrongPassword = (password) => password.length >= 7;

module.exports = { isValidEmail, isStrongPassword };

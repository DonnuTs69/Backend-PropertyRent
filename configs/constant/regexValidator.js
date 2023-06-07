const PASSWORD_VALIDATOR =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
const EMAIL_VALIDATOR = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

module.exports = {
  PASSWORD_VALIDATOR,
  EMAIL_VALIDATOR,
}

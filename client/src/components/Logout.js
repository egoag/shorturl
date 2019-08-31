const Logout = ({ history }) => {
  localStorage.clear()
  history.push('/')
  return null
}

export default Logout

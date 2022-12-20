import { UserContext } from 'lib/UserContext'
import { useContext } from 'react'
import apiConnect from 'lib/apiConnect'

export default function FormSignUp () {
  const { setRole } = useContext(UserContext)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (
      !event.target.login.value ||
      !event.target.password.value ||
      !event.target.role.value
    ) {
      alert('Veuiller entrer un login, un mot de passe et un role')
    } else {
      const data = {
        login: event.target.login.value,
        password: event.target.password.value,
        role: event.target.role.value
      }
      const JSONdata = JSON.stringify(data)
      const endpoint = `${apiConnect()}/auth/signup`
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSONdata
      }

      fetch(endpoint, options)
        .then(result => result.json())
        .then(response => {
          if (!response.role) {
            alert(response.message)
          } else {
            setRole(response.role)
          }
        })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} method='POST' className=' bordered'>
        <label htmlFor='login'>Login:</label>
        <br />
        <input type='text' id='login' name='login' />
        <br />
        <label htmlFor='password'>mot de passe:</label>
        <br />
        <input type='password' id='password' name='password' />
        <br />
        <label htmlFor='role'>role:</label>
        <br />
        <input type='text' id='role' name='role' />
        <br />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

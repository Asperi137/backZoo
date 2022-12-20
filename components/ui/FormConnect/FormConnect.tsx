import IsConnected from 'lib/isConnected'
import { UserContext } from 'lib/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import FormSignUp from './FormSignup'

export default function FormConnect () {
  const { setRole } = useContext(UserContext)
  const router = useRouter()

  const deconnection = async (event: any) => {
    setRole('')
    router.push('/')
  }

  const connection = async (role: string) => {
    setRole(role)
    if (role !== 'admin') {
      router.push('/enclos')
    }
  }

  const formSubmit = async (event: any) => {
    event.preventDefault()
    if (!event.target.login.value || !event.target.password.value) {
      alert('Veuiller entrer un login et un mot de passe')
      deconnection(event)
    } else {
      const data = {
        login: event.target.login.value,
        password: event.target.password.value
      }
      const JSONdata = JSON.stringify(data)
      const endpoint = `api/auth/login`
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
            connection(response.role)
          }
        })
    }
  }

  return (
    <>
      {!IsConnected() && (
        <form id='login' onSubmit={formSubmit} method='POST'>
          <label htmlFor='login'>Login:</label>
          <br />
          <input type='text' id='login' name='login' required />
          <br />
          <label htmlFor='password'>mot de passe:</label>
          <br />
          <input type='password' id='password' name='password' required />
          <br />
          <button type='submit'>Submit</button>
        </form>
      )}
      {IsConnected() && IsConnected() === 'admin' && (
        <>
          <FormSignUp />
          <Link href='api-doc'>
            <button>api-doc</button>
          </Link>
        </>
      )}
    </>
  )
}

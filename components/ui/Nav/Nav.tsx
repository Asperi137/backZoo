import classes from './Nav.module.css'
import IsConnected from 'lib/isConnected'
import { UserContext } from 'lib/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import apiConnect from 'lib/apiConnect'

export default function Nav () {
  const { setRole } = useContext(UserContext)
  const router = useRouter()

  const deconnection = async () => {
    await fetch(`${apiConnect()}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login: '', password: '', role: '' })
    })
      .then(res => res.json())
      .then(() => {
        setRole('')
        router.push('/')
      })
  }

  return (
    <>
      {!IsConnected() && <Link href='/'>Connection</Link>}
      {IsConnected() && (
        <nav className={classes.contH}>
          <div className={classes.Sepbot}>
            <Link href='/'>
              <span onClick={deconnection}>déconnection</span>
            </Link>
          </div>
          <div className={classes.Sepbot}>
            <Link href='/enclos'>enclos</Link>
            <Link href='/especes'>especes</Link>
            <Link href='/animaux'>animaux</Link>
          </div>
          <div className={classes.Sepbot}>
            <Link href='/evenements'>Evenement</Link>
          </div>
        </nav>
      )}
    </>
  )
}

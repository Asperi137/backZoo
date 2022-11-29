import IsConnected from 'lib/isConnected'
import { UserContext } from 'lib/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'

export default function Nav () {
  const { setRole } = useContext(UserContext)
  const router = useRouter()

  const deconection = async () => {
    setRole('')
    window.localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <>
      {!IsConnected() && <Link href='/'>Connection</Link>}
      {IsConnected() && (
        <nav className='containerH'>
          <div className='containerH'>
            <Link href='/'>retour à l'accueil</Link>|
          </div>
          <div className='containerH'>
            <Link href='/'>
              <span onClick={deconection}>déconnection</span>
            </Link>
            |
          </div>
          <div className='containerH'>
            <Link href='/enclos'>enclos</Link>
            <Link href='/especes'>especes</Link>
            <Link href='/animaux'>animaux</Link>|
          </div>

          <div className='containerH'>
            <Link href='/evenements'>Evenement</Link>
          </div>
        </nav>
      )}
    </>
  )
}

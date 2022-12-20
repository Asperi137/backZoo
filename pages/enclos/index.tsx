import Enclos from 'Types/Enclos'
import Zones from 'Types/Zones'
import Link from 'next/link'
import IsConnected from 'lib/isConnected'
import { withSessionSsr } from 'lib/withSession'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import User from 'Types/User'
import apiConnect from 'lib/apiConnect'

type Props = {
  enclos: Enclos[]
  zones: Zones[]
  user: User
  headers: Headers
}

export default function Index ({
  enclos,
  zones,
  user,
  headers
}: Props): JSX.Element {
  return (
    <div className='containerH'>
      {IsConnected(user) &&
        zones.map((zone: Zones) => (
          <div key={zone._id} className='containerV , alignCenter , bordered'>
            <h2 className='description'>{`${zone.nom}`}</h2>
            <div className='containerV'>
              {enclos.map(
                (enclos: Enclos) =>
                  enclos.zone === zone._id && (
                    <button key={enclos._id}>
                      <Link href='/enclos/[id]' as={`/enclos/${enclos._id}`}>
                        {`${enclos.nom}`}
                      </Link>
                    </button>
                  )
              )}
            </div>
          </div>
        ))}
      {!IsConnected(user) && (
        <button className='btnRetour'>
          <Link href='/'>Veillez vous connecter</Link>
        </button>
      )}
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps ({ params, req }: Params) {
    const headers = req.headers
    const user = req.session.user

    const zones: Zones[] = await fetch(`${apiConnect()}zones/`, {
      headers
    }).then(res => res.json())
    const enclos: Enclos[] = await fetch(`${apiConnect()}enclos/`, {
      headers
    }).then(res => res.json())
    return {
      props: {
        enclos,
        zones,
        user,
        headers
      }
    }
  }
)

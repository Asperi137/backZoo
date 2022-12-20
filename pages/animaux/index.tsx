import Especes from 'Types/Especes'
import Link from 'next/link'
import Animaux from 'Types/Animaux'
import IsConnected from 'lib/isConnected'
import { withSessionSsr } from 'lib/withSession'
import User from 'Types/User'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import apiConnect from 'lib/apiConnect'

type Props = {
  animaux: Animaux[]
  especes: Especes[]
  user: User
  headers: Headers
}

export default function Index ({
  animaux,
  especes,
  user,
  headers
}: Props): JSX.Element {
  return (
    <div className='containerH'>
      {IsConnected(user) &&
        especes.map((espece: Especes) => (
          <div key={espece._id} className='containerV , alignCenter , bordered'>
            <Link href='/especes/[id]' as={`/especes/${espece._id}`}>
              <h2 className='description'>{`${espece.nom}`}</h2>
            </Link>
            <div className='containerV'>
              {animaux.map(
                (animal: Animaux) =>
                  animal.espece === espece._id && (
                    <button key={animal._id}>
                      <Link href='/animaux/[id]' as={`/animaux/${animal._id}`}>
                        {`${animal.nom}`}
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
    const especes: Especes[] = await fetch(`${apiConnect()}especes`, {
      headers
    }).then(res => res.json())
    const animaux: Animaux[] = await fetch(`${apiConnect()}animaux`, {
      headers
    }).then(res => res.json())
    return {
      props: {
        animaux,
        especes,
        user,
        headers
      }
    }
  }
)

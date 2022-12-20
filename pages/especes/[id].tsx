import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import Link from 'next/link'
import Animaux from 'Types/Animaux'
import Especes from 'Types/Especes'
import Enclos from 'Types/Enclos'
import Zones from 'Types/Zones'
import InfoEspece from 'components/ui/barreInfo/InfoEspece'
import InfoEnclos from 'components/ui/barreInfo/InfoEnclos'
import IsConnected from 'lib/isConnected'
import BoutonAction from 'components/ui/boutonAction/BoutonAction'
import TableauEvent, { tri } from 'components/ui/TableauEvent/TableauEvent'
import Evenements from 'Types/Evenements'
import { withSessionSsr } from 'lib/withSession'
import User from 'Types/User'
import apiConnect from 'lib/apiConnect'

type props = {
  animaux: Animaux[]
  espece: Especes
  enclos: Enclos
  zone: Zones
  event: Evenements[]
  user: User
  headers: Headers
}

export default function Index ({
  animaux,
  espece,
  enclos,
  zone,
  event,
  user,
  headers
}: props): JSX.Element {
  return (
    <div className='containerV'>
      {IsConnected(user) && (
        <>
          <button className='btnRetour'>
            <Link
              href={`/enclos/${espece.enclos}`}
              as={`/enclos/${espece.enclos}`}
            >
              {`retour à l'enclos : ${enclos.nom} `}
            </Link>
          </button>
          <div className='containerH'>
            <h2 className='alignCenter'>{espece.nom}</h2>
            <InfoEnclos enclos={enclos} zone={zone} />
            <InfoEspece espece={espece} />
            <div className='containerV'>
              {animaux.map(
                (animal: Animaux) =>
                  animal.espece === espece._id && (
                    <div key={animal._id}>
                      <button>
                        <Link
                          href='/animaux/[id]'
                          as={`/animaux/${animal._id}`}
                        >
                          {`${animal.nom}`}
                        </Link>
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className='containerV'>
            <BoutonAction
              headers={headers}
              cible={espece._id}
              action={'nourrir'}
            />
            <BoutonAction
              headers={headers}
              cible={espece._id}
              action={'stimuler'}
            />
          </div>
          <TableauEvent affichage={event} />
        </>
      )}
      {!IsConnected() && (
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
    const espece = await fetch(`${apiConnect()}especes/${params.id}`, {
      headers
    }).then(res => res.json())
    const enclos: Enclos = await fetch(
      `${apiConnect()}enclos/${espece.enclos}`,
      {
        headers
      }
    ).then(res => res.json())
    const zone: Zones = await fetch(`${apiConnect()}zones/${enclos.zone}`, {
      headers
    }).then(res => res.json())
    const animaux = await fetch(`${apiConnect()}animaux`, { headers }).then(
      res => res.json()
    )
    const event = tri(
      await fetch(`${apiConnect()}evenements/especes/${params.id}`, {
        headers
      }).then(res => res.json())
    )
    return {
      props: {
        animaux,
        espece,
        enclos,
        zone,
        event,
        user,
        headers
      }
    }
  }
)

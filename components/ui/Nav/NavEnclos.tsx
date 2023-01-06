import classes from './NavFooter.module.css'
import Link from 'next/link'
import apiConnect from 'lib/apiConnect'
import { useEffect, useState } from 'react'
import Enclos from 'Types/Enclos'

export default function NavEnclos () {
  const [encloslst, setEncloslst] = useState<Enclos[]>([])

  useEffect(() => {
    const enclosFetch = async () => {
      const encloslist: Enclos[] = await (
        await fetch(`${apiConnect()}enclos`)
      ).json()
      encloslist.sort((a, b) => a.nom.localeCompare(b.nom))
      setEncloslst(encloslist)
    }
    enclosFetch()
  }, [])

  return (
    <>
      <div className={classes.lstV}>
        <u>
          <Link href={`/enclos`}>Liste des Enclos</Link>
        </u>
        <br />
        {encloslst.map(enclos => (
          <Link key={enclos._id} href={`/enclos/${enclos._id}`}>
            {enclos.nom}
          </Link>
        ))}
      </div>
    </>
  )
}

import classes from './NavFooter.module.css'
import Link from 'next/link'
import apiConnect from 'lib/apiConnect'
import { useEffect, useState } from 'react'
import Especes from 'Types/Especes'

export default function NavEspeces () {
  const [especeslst, setEspeceslst] = useState<Especes[]>([])

  useEffect(() => {
    const especesFetch = async () => {
      const especeslist: Especes[] = await (
        await fetch(`${apiConnect()}especes`)
      ).json()
      especeslist.sort((a, b) => a.nom.localeCompare(b.nom))
      setEspeceslst(especeslist)
    }
    especesFetch()
  }, [])

  return (
    <>
      <div className={classes.lstV}>
        <Link href={`/especes`}>Toutes</Link>
        <br />
        {especeslst.map(espece => (
          <Link key={espece._id} href={`/especes/${espece._id}`}>
            {espece.nom}
          </Link>
        ))}
      </div>
    </>
  )
}

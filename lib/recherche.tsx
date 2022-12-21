import Animaux from 'Types/Animaux'
import Enclos from 'Types/Enclos'
import Especes from 'Types/Especes'
import apiConnect from './apiConnect'
import { NextRouter } from 'next/router'

export default async function recherche (recherche: string, router: NextRouter) {
  const encloslist: Enclos[] = await (
    await fetch(`${apiConnect()}enclos`)
  ).json()
  encloslist.sort((a, b) => a.nom.localeCompare(b.nom))

  const especeslist: Especes[] = await (
    await fetch(`${apiConnect()}especes`)
  ).json()
  especeslist.sort((a, b) => a.nom.localeCompare(b.nom))

  const animauxlst: Animaux[] = await (
    await fetch(`${apiConnect()}animaux`)
  ).json()
  animauxlst.sort((a, b) => a.nom.localeCompare(b.nom))

  if (
    recherche === 'enclos' ||
    recherche === 'especes' ||
    recherche === 'animaux'
  ) {
    router.push(`/${recherche}`)
    return
  }
  for (const animal of animauxlst) {
    if (
      recherche === animal._id.toLowerCase().trim() ||
      recherche === animal.nom.toLowerCase().trim()
    ) {
      router.push(`/animaux/${animal._id}`)
      return
    }
  }
  for (const especes of especeslist) {
    if (
      recherche === especes._id.toLowerCase().trim() ||
      recherche === especes.nom.toLowerCase().trim()
    ) {
      router.push(`/especes/${especes._id}`)
      return
    }
  }
  for (const enclos of encloslist) {
    if (
      recherche === enclos._id.toLowerCase().trim() ||
      recherche === enclos.nom.toLowerCase().trim()
    ) {
      router.push(`/enclos/${enclos._id}`)
      return
    }
  }
  alert('Veuiller entrer un sujet de recherche valide')
}

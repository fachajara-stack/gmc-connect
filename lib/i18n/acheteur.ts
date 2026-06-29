export type AcheteurLang = 'fr' | 'es' | 'en'

export type AcheteurTranslations = {
  // header
  espaceAcheteur: string
  logout: string
  // titre + sous-titre catalogue
  catalogueTitre: string
  catalogueVide: string    // sous-titre quand 0 lots
  lotWord: string          // "lot" / "lote"
  disponibleAdj: string    // "disponible" (utilisé pour "{n} lots disponibles")
  origineLabel: string     // "origine Colombie" / "origen Colombia" / "origin Colombia"
  // bannière info
  bannerTitre: string
  bannerTexte: string
  // état vide
  emptyTitre: string
  emptyTexte1: string
  emptyTexte2: string
  // carte lot
  origineDisplay: string   // "🇨🇴 Colombie" etc.
  disponibleBadge: string  // badge sur la carte quand pas de photo
  kgLabel: string          // "disponibles" / "disponibles" / "available"
  dispoLe: string          // "Dispo le" / "Disponible el" / "Available on"
  // bouton intérêt
  btnInteret: string
  btnEnvoi: string
  confirmTitre: string
  confirmTexte: string
  confirmRef: string
  erreur: string
  venduBadge: string
  // locale numérique et date (utilisé dans le formatage)
  numLocale: string
  dateLocale: string
}

export const acheteurT: Record<AcheteurLang, AcheteurTranslations> = {
  fr: {
    espaceAcheteur: 'Espace Acheteur',
    logout: 'Se déconnecter',
    catalogueTitre: 'Catalogue disponible',
    catalogueVide: 'Aucun lot disponible pour le moment',
    lotWord: 'lot',
    disponibleAdj: 'disponible',
    origineLabel: 'origine Colombie',
    bannerTitre: 'Intéressé par un lot ?',
    bannerTexte: 'Cliquez sur « Je suis intéressé » pour transmettre votre demande à GMC. Notre équipe vous recontactera directement pour discuter des conditions — prix, quantité, livraison.',
    emptyTitre: 'Aucun lot disponible',
    emptyTexte1: 'Les prochaines disponibilités seront publiées ici par GMC.',
    emptyTexte2: 'Votre interlocuteur GMC peut vous contacter en avance.',
    origineDisplay: '🇨🇴 Colombie',
    disponibleBadge: 'Disponible',
    kgLabel: 'disponibles',
    dispoLe: 'Dispo le',
    btnInteret: '🌿 Je suis intéressé',
    btnEnvoi: 'Envoi en cours…',
    confirmTitre: '✓ Intérêt transmis à GMC',
    confirmTexte: 'Notre équipe vous recontactera rapidement pour discuter des conditions.',
    confirmRef: 'Réf.',
    erreur: 'Une erreur est survenue, réessayez.',
    venduBadge: 'VENDU',
    numLocale: 'fr-FR',
    dateLocale: 'fr-FR',
  },
  es: {
    espaceAcheteur: 'Espacio Comprador',
    logout: 'Cerrar sesión',
    catalogueTitre: 'Catálogo disponible',
    catalogueVide: 'Ningún lote disponible por el momento',
    lotWord: 'lote',
    disponibleAdj: 'disponible',
    origineLabel: 'origen Colombia',
    bannerTitre: '¿Interesado en un lote?',
    bannerTexte: 'Haga clic en «Me interesa» para enviar su solicitud a GMC. Nuestro equipo le contactará directamente para hablar de las condiciones — precio, cantidad, entrega.',
    emptyTitre: 'Ningún lote disponible',
    emptyTexte1: 'Las próximas disponibilidades serán publicadas aquí por GMC.',
    emptyTexte2: 'Su interlocutor en GMC puede contactarle con antelación.',
    origineDisplay: '🇨🇴 Colombia',
    disponibleBadge: 'Disponible',
    kgLabel: 'disponibles',
    dispoLe: 'Disponible el',
    btnInteret: '🌿 Me interesa',
    btnEnvoi: 'Enviando…',
    confirmTitre: '✓ Interés enviado a GMC',
    confirmTexte: 'Nuestro equipo le contactará pronto para discutir las condiciones.',
    confirmRef: 'Ref.',
    erreur: 'Ha ocurrido un error, inténtelo de nuevo.',
    venduBadge: 'VENDIDO',
    numLocale: 'es-CO',
    dateLocale: 'es-CO',
  },
  en: {
    espaceAcheteur: 'Buyer Space',
    logout: 'Sign out',
    catalogueTitre: 'Available catalog',
    catalogueVide: 'No lots available at the moment',
    lotWord: 'lot',
    disponibleAdj: 'available',
    origineLabel: 'origin Colombia',
    bannerTitre: 'Interested in a lot?',
    bannerTexte: 'Click "I\'m interested" to send your request to GMC. Our team will contact you directly to discuss terms — price, quantity, delivery.',
    emptyTitre: 'No lots available',
    emptyTexte1: 'Upcoming availability will be published here by GMC.',
    emptyTexte2: 'Your GMC contact may reach out to you in advance.',
    origineDisplay: '🇨🇴 Colombia',
    disponibleBadge: 'Available',
    kgLabel: 'available',
    dispoLe: 'Available on',
    btnInteret: '🌿 I\'m interested',
    btnEnvoi: 'Sending…',
    confirmTitre: '✓ Interest sent to GMC',
    confirmTexte: 'Our team will contact you shortly to discuss the terms.',
    confirmRef: 'Ref.',
    erreur: 'An error occurred, please try again.',
    venduBadge: 'SOLD',
    numLocale: 'en-GB',
    dateLocale: 'en-GB',
  },
}

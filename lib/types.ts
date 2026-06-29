export type Role = 'cultivateur' | 'acheteur' | 'admin'
export type Status = 'pending' | 'approved' | 'rejected'
export type LotStatut = 'en_attente' | 'contacte' | 'accepte' | 'refuse'

export interface Lot {
  id: string
  cultivateur_id: string
  produit: string
  quantite_kg: number
  date_disponibilite: string
  description?: string | null
  statut: LotStatut
  visible_acheteurs: boolean
  photos?: string[] | null
  video_url?: string | null
  created_at: string
  vendu_le?: string | null
}

export interface LotAvecCultivateur extends Lot {
  profiles: {
    full_name: string
    region?: string | null
    ville?: string | null
  }
}

export type InteretStatut = 'nouveau' | 'traite'

export interface InteretAcheteur {
  id: string
  lot_id: string | null
  acheteur_id: string
  code_anonyme: string
  created_at: string
  statut: InteretStatut
}

export interface InteretAvecDetails extends InteretAcheteur {
  lots: {
    produit: string
    quantite_kg: number
    date_disponibilite: string
  } | null
  profiles: {
    full_name: string
    company: string | null
    country: string | null
    email: string
  } | null
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  status: Status
  phone?: string | null
  region?: string | null
  ville?: string | null
  produits?: string | null
  description?: string | null
  company?: string | null
  country?: string | null
  vat_number?: string | null
  rejection_reason?: string | null
  ica_certifie?: boolean | null
  created_at: string
  updated_at: string
}

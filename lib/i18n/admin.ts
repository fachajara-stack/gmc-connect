export type Lang = 'fr' | 'es'

export type AdminTranslations = {
  // header commun
  dashboardAdmin: string
  dashboardGMC: string
  logout: string
  // nav tiles (/admin)
  youAreHere: string
  gestionComptes: string
  gestionSubtitle: string
  lotsTitle: string
  lotsSubtitle: string
  lotsBadge: string
  // stats comptes
  statEnAttente: string
  statApprouves: string
  statRefuses: string
  // sections comptes
  sectionCultivateurs: string
  sectionAcheteurs: string
  subEnAttente: string
  subApprouves: string
  subRefuses: string
  // empty states comptes
  emptyNoCultivateur: string
  emptyNoAcheteur: string
  emptyNoPending: string
  // AdminUserCard — statuts
  statusPending: string
  statusApproved: string
  statusRejected: string
  // AdminUserCard — rôles
  roleCultivateur: string
  roleAcheteur: string
  roleAdmin: string
  // AdminUserCard — actions
  raisonRefus: string
  btnApprouver: string
  btnRefuser: string
  btnConfirmerRefus: string
  motifLabel: string
  // ── Page /admin/lots ──────────────────────────────────────────────────────
  lotsDashboard: string        // lien breadcrumb "Dashboard"
  lotsBreadcrumb: string       // "Lots cultivateurs"
  lotsH1: string               // titre h1
  lotsAucunPublie: string      // subtitle quand total=0
  lotsAucunDesc: string        // description vide
  lotsWord: string             // "lot" / "lote" pour pluralisation
  lotsAuTotal: string          // "au total" / "en total"
  // statuts lot (badge sur carte)
  lotStatutEnAttente: string
  lotStatutContacte: string
  lotStatutAccepte: string
  lotStatutRefuse: string
  // labels sections (pluriel)
  lotSectionEnAttente: string
  lotSectionContacte: string
  lotSectionAccepte: string
  lotSectionRefuse: string
  // AdminLotCard — messages
  cardInteretManifeste: string
  cardVisibleCatalogue: string
  // AdminLotCard — boutons
  btnManifesterInteret: string
  btnRetirerInteret: string
  btnAccepterLot: string
  btnRefuserLot: string
  btnPublierAcheteurs: string
  btnRetirerCatalogue: string
  btnMarquerVendu: string
  badgeVendu: string
  cardVenduInfo: string
  // ── Section demandes d'intérêt ───────────────────────────────────────────
  interetsTitle: string
  interetsSubtitle: string
  interetsBadge: string
  interetsBreadcrumb: string
  interetsH1: string
  interetsVide: string
  interetsVideDesc: string
  cardInteretProduit: string
  cardInteretQuantite: string
  cardInteretCode: string
  cardInteretAcheteur: string
  cardInteretEntreprise: string
  cardInteretPays: string
  cardInteretDate: string
  cardInteretStatutNouveau: string
  cardInteretStatutTraite: string
  btnMarquerTraite: string
  // ICA (cultivateur uniquement)
  icaCertifie: string
  icaNonCertifie: string
  icaInconnu: string
}

export const adminT: Record<Lang, AdminTranslations> = {
  fr: {
    dashboardAdmin: 'Dashboard Admin',
    dashboardGMC: 'Dashboard GMC',
    logout: 'Se déconnecter',
    youAreHere: 'Vous êtes ici',
    gestionComptes: '👤 Gestion des comptes',
    gestionSubtitle: 'Valider les inscriptions cultivateurs et acheteurs',
    lotsTitle: '📦 Lots cultivateurs',
    lotsSubtitle: "Voir les lots publiés et manifester l'intérêt de GMC",
    lotsBadge: 'en attente',
    statEnAttente: 'En attente',
    statApprouves: 'Approuvés',
    statRefuses: 'Refusés',
    sectionCultivateurs: 'Cultivateurs',
    sectionAcheteurs: 'Acheteurs européens',
    subEnAttente: 'En attente de validation',
    subApprouves: 'Approuvés',
    subRefuses: 'Refusés',
    emptyNoCultivateur: 'Aucun compte cultivateur pour le moment',
    emptyNoAcheteur: 'Aucun compte acheteur pour le moment',
    emptyNoPending: 'Aucune demande en attente',
    statusPending: 'En attente',
    statusApproved: 'Approuvé',
    statusRejected: 'Refusé',
    roleCultivateur: '🌱 Cultivateur',
    roleAcheteur: '🛒 Acheteur',
    roleAdmin: '⚙️ Admin',
    raisonRefus: 'Raison du refus (optionnel)',
    btnApprouver: '✓ Approuver',
    btnRefuser: '✕ Refuser',
    btnConfirmerRefus: 'Confirmer le refus',
    motifLabel: 'Motif',
    // Lots page
    lotsDashboard: 'Dashboard',
    lotsBreadcrumb: 'Lots cultivateurs',
    lotsH1: 'Lots cultivateurs',
    lotsAucunPublie: 'Aucun lot publié',
    lotsAucunDesc: 'Les cultivateurs approuvés peuvent publier des lots depuis leur dashboard.',
    lotsWord: 'lot',
    lotsAuTotal: 'au total',
    lotStatutEnAttente: 'En attente',
    lotStatutContacte: 'Contacté par GMC',
    lotStatutAccepte: 'Accepté',
    lotStatutRefuse: 'Refusé',
    lotSectionEnAttente: 'En attente',
    lotSectionContacte: 'Contactés par GMC',
    lotSectionAccepte: 'Acceptés',
    lotSectionRefuse: 'Refusés',
    cardInteretManifeste: 'GMC a manifesté son intérêt — le cultivateur sera contacté directement.',
    cardVisibleCatalogue: '🛒 Visible dans le catalogue acheteurs',
    btnManifesterInteret: "Manifester l'intérêt",
    btnRetirerInteret: "Retirer l'intérêt",
    btnAccepterLot: '✓ Accepter',
    btnRefuserLot: '✕ Refuser',
    btnPublierAcheteurs: '🛒 Publier aux acheteurs',
    btnRetirerCatalogue: 'Retirer du catalogue',
    btnMarquerVendu: '✓ Marquer vendu',
    badgeVendu: 'VENDU',
    cardVenduInfo: 'Vendu — {n} jour(s) restant(s) dans le catalogue',
    interetsTitle: '📩 Demandes d\'intérêt',
    interetsSubtitle: 'Acheteurs intéressés par les lots du catalogue',
    interetsBadge: 'nouveau',
    interetsBreadcrumb: 'Demandes d\'intérêt',
    interetsH1: 'Demandes d\'intérêt acheteurs',
    interetsVide: 'Aucune demande pour le moment',
    interetsVideDesc: 'Les demandes s\'afficheront ici quand des acheteurs cliqueront sur "Je suis intéressé".',
    cardInteretProduit: 'Produit',
    cardInteretQuantite: 'Quantité',
    cardInteretCode: 'Référence',
    cardInteretAcheteur: 'Acheteur',
    cardInteretEntreprise: 'Entreprise',
    cardInteretPays: 'Pays',
    cardInteretDate: 'Date',
    cardInteretStatutNouveau: 'Nouveau',
    cardInteretStatutTraite: 'Traité',
    btnMarquerTraite: '✓ Marquer traité',
    icaCertifie: 'ICA certifié',
    icaNonCertifie: 'Sans ICA',
    icaInconnu: 'ICA ?',
  },
  es: {
    dashboardAdmin: 'Panel Admin',
    dashboardGMC: 'Panel GMC',
    logout: 'Cerrar sesión',
    youAreHere: 'Estás aquí',
    gestionComptes: '👤 Gestión de cuentas',
    gestionSubtitle: 'Validar las inscripciones de cultivadores y compradores',
    lotsTitle: '📦 Lotes de cultivadores',
    lotsSubtitle: 'Ver los lotes publicados y manifestar el interés de GMC',
    lotsBadge: 'en espera',
    statEnAttente: 'En espera',
    statApprouves: 'Aprobados',
    statRefuses: 'Rechazados',
    sectionCultivateurs: 'Cultivadores',
    sectionAcheteurs: 'Compradores europeos',
    subEnAttente: 'En espera de validación',
    subApprouves: 'Aprobados',
    subRefuses: 'Rechazados',
    emptyNoCultivateur: 'No hay cuentas de cultivador por el momento',
    emptyNoAcheteur: 'No hay cuentas de comprador por el momento',
    emptyNoPending: 'Ninguna solicitud pendiente',
    statusPending: 'En espera',
    statusApproved: 'Aprobado',
    statusRejected: 'Rechazado',
    roleCultivateur: '🌱 Cultivador',
    roleAcheteur: '🛒 Comprador',
    roleAdmin: '⚙️ Admin',
    raisonRefus: 'Motivo de rechazo (opcional)',
    btnApprouver: '✓ Aprobar',
    btnRefuser: '✕ Rechazar',
    btnConfirmerRefus: 'Confirmar rechazo',
    motifLabel: 'Motivo',
    // Lots page
    lotsDashboard: 'Panel',
    lotsBreadcrumb: 'Lotes de cultivadores',
    lotsH1: 'Lotes de cultivadores',
    lotsAucunPublie: 'Ningún lote publicado',
    lotsAucunDesc: 'Los cultivadores aprobados pueden publicar lotes desde su panel.',
    lotsWord: 'lote',
    lotsAuTotal: 'en total',
    lotStatutEnAttente: 'En espera',
    lotStatutContacte: 'Contactado por GMC',
    lotStatutAccepte: 'Aceptado',
    lotStatutRefuse: 'Rechazado',
    lotSectionEnAttente: 'En espera',
    lotSectionContacte: 'Contactados por GMC',
    lotSectionAccepte: 'Aceptados',
    lotSectionRefuse: 'Rechazados',
    cardInteretManifeste: 'GMC ha manifestado su interés — el cultivador será contactado directamente.',
    cardVisibleCatalogue: '🛒 Visible en el catálogo de compradores',
    btnManifesterInteret: 'Manifestar interés',
    btnRetirerInteret: 'Retirar el interés',
    btnAccepterLot: '✓ Aceptar',
    btnRefuserLot: '✕ Rechazar',
    btnPublierAcheteurs: '🛒 Publicar a compradores',
    btnRetirerCatalogue: 'Retirar del catálogo',
    btnMarquerVendu: '✓ Marcar vendido',
    badgeVendu: 'VENDIDO',
    cardVenduInfo: 'Vendido — {n} día(s) restante(s) en el catálogo',
    interetsTitle: '📩 Solicitudes de interés',
    interetsSubtitle: 'Compradores interesados en los lotes del catálogo',
    interetsBadge: 'nuevo',
    interetsBreadcrumb: 'Solicitudes de interés',
    interetsH1: 'Solicitudes de interés de compradores',
    interetsVide: 'Ninguna solicitud por el momento',
    interetsVideDesc: 'Las solicitudes aparecerán aquí cuando los compradores hagan clic en "Me interesa".',
    cardInteretProduit: 'Producto',
    cardInteretQuantite: 'Cantidad',
    cardInteretCode: 'Referencia',
    cardInteretAcheteur: 'Comprador',
    cardInteretEntreprise: 'Empresa',
    cardInteretPays: 'País',
    cardInteretDate: 'Fecha',
    cardInteretStatutNouveau: 'Nuevo',
    cardInteretStatutTraite: 'Tratado',
    btnMarquerTraite: '✓ Marcar tratado',
    icaCertifie: 'ICA certificado',
    icaNonCertifie: 'Sin ICA',
    icaInconnu: '¿ICA?',
  },
}

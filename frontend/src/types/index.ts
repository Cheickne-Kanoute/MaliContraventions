export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    telephone: string;
    badge_agent?: string;
    nin_carte_identite?: string;
    service_agent?: string;
}

export interface Infraction {
    id: number;
    code: string;
    libelle: string;
    montant_amende: number;
    montant?: number;
    points_retires: number;
}

export interface Contravention {
    id: number;
    numero: string;
    date_contravention: string;
    immatriculation_vehicule: string;
    type_vehicule?: string;
    lieu_adresse?: string;
    photo_preuve?: string;
    montant: number;
    statut: string;
    commune: string;
    agent_details?: User;
    citoyen_details?: User;
    infraction_details?: Infraction;
}

export interface GPSLocation {
    lat: number;
    lng: number;
    numero: string;
    infraction: string;
    montant: number;
    date: string;
}

export interface Paiement {
    id: number;
    montant: string;
    date_paiement: string;
    mode_paiement: string;
    reference_transaction: string;
    statut: string;
}

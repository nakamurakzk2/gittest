export enum AdminApplicationStatus {
  UNCHECKED = 'unchecked',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type SuperAdminApplication = {
  userId: string
  email: string
  name: string
  status: AdminApplicationStatus
  createdAt: number
}

export type TownApplication = {
  userId: string
  email: string
  name: string
  phoneNumber: string
  townId: string
  status: AdminApplicationStatus
  createdAt: number
}

export type BusinessApplication = {
  userId: string
  email: string
  name: string
  phoneNumber: string
  townId: string | null
  businessName: string
  status: AdminApplicationStatus
  createdAt: number
}


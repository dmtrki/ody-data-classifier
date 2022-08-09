export const EnquiryStatus = {
  ACCEPTED: 'ACCEPTED',
  WAITING: 'WAITING',
  PROCESSING: 'PROCESSING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
}

export type EnquiryStatus = typeof EnquiryStatus[keyof typeof EnquiryStatus]

import { toast } from 'react-toastify'

export const createSuccessNotification = (msg: string) => {
  toast.success(msg, { toastId: 'success-notification' })
}

export const createFailureNotification = (msg: string) => {
  toast.error(msg, { toastId: 'error-notification' })
}

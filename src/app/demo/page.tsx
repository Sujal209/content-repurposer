import { ModalDemo } from '@/components/modal-demo'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

export default function DemoPage() {
  return <ModalDemo />
}

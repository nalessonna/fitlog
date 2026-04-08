import { Suspense } from "react"
import { DashboardContent } from "./DashboardContent"

interface Props {
  searchParams: Promise<{ view?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { view } = await searchParams
  return (
    <Suspense>
      <DashboardContent viewAccountId={view} />
    </Suspense>
  )
}

import { Suspense } from "react"
import { WorkoutLogForm } from "@/components/workout-log/WorkoutLogForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface Props {
  params:      Promise<{ date: string }>
  searchParams: Promise<{ view?: string }>
}

export default async function WorkoutLogPage({ params, searchParams }: Props) {
  const cookieStore = await cookies()
  if (!cookieStore.get("auth_token")) redirect("/")

  const { date } = await params
  const { view } = await searchParams

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
      <Suspense>
        <WorkoutLogPageContent date={date} viewAccountId={view} />
      </Suspense>
    </div>
  )
}

function WorkoutLogPageContent({
  date,
  viewAccountId,
}: {
  date: string
  viewAccountId?: string
}) {
  // accountId と isSelf はクライアント側で profile から解決する必要があるため
  // WorkoutLogForm に委譲する
  return (
    <WorkoutLogFormWrapper date={date} viewAccountId={viewAccountId} />
  )
}

// クライアントコンポーネントへのブリッジ
import { WorkoutLogFormWrapper } from "./WorkoutLogFormWrapper"

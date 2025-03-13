import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"

export type BasicStats = {
  label: string
  data: number
  progress?: boolean
  icon: LucideIcon
}

export type AdvanceStats = {
  title: string
  label: string
  sublabel: string
  icon: LucideIcon
}

export function BasicStatsCard({
  data,
  label,
  progress,
  icon: Icon
}: BasicStats) {
  return (
    <Card className="relative rounded-sm p-0 m-0 shadow-none dark:bg-transparent">
      <CardHeader className="p-2 px-4 flex flex-row items-center justify-between">
        {label}
        <Icon size={16} />
      </CardHeader>
      {progress ? (
        <CardContent className="p-2 px-4 font-semibold text-xl flex gap-2 items-center">
          <p>{data}%</p>
          <Progress value={data} />
        </CardContent>
      ) : (
        <CardContent className="p-2 px-4 font-semibold text-xl">
          {data}
        </CardContent>
      )}
    </Card>
  )
}

export function AdvancedStatsCard({
  label,
  sublabel,
  title,
  icon: Icon
}: AdvanceStats) {
  return (
    <Card className="relative rounded-sm shadow-none dark:bg-transparent">
      {/* <div className="absolute inset-0 bg-dot-pattern opacity-20"></div> */}
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        {title}
        <Icon size={16} />
      </CardHeader>
      <CardContent className="pb-3 flex flex-col">
        <p className=" font-semibold">{label}</p>
        <p className="text-slate-800 dark:text-slate-400 text-sm">
          {sublabel && sublabel.split(", ").length > 2
            ? sublabel.split(", ").slice(0, 2).join(", ") + " and more..."
            : sublabel}
        </p>
      </CardContent>
    </Card>
  )
}

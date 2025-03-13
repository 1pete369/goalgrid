import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import React from "react"

export default function MainAddButton({feature} : {feature : string}) {
  return (
    <Button className="font-semibold text-base">
      <Plus />
      <p className="hidden md:flex">
      Add new {feature}!
      </p>
    </Button>
  )
}

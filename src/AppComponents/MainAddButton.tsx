import React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface MainAddButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  feature: string
}

export const MainAddButton = React.forwardRef<HTMLButtonElement, MainAddButtonProps>(
  ({ feature, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className="font-semibold text-base flex items-center gap-1 bg-primary-800 hover:bg-primary-800"
      >
        <Plus className="w-4 h-4" />
        Add
        <span className="hidden md:inline">{feature}!</span>
      </Button>
    )
  }
)

MainAddButton.displayName = "MainAddButton"

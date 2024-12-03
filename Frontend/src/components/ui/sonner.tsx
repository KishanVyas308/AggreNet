import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#1A1F2C] group-[.toaster]:text-white group-[.toaster]:border-[#2A2F3A] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-cyan group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#2A2F3A] group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
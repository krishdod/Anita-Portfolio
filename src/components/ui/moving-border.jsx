import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        "relative text-xl p-[1px] overflow-hidden",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)`,
          backgroundSize: "300% 300%",
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)`,
            backgroundSize: "300% 300%",
          }}
          className="absolute inset-0"
        />
      </div>

      <div
        className={cn(
          "relative bg-slate-900/90 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${rx}px - 1px) calc(${ry}px - 1px)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}

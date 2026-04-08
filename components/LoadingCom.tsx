"use client";

// Loading component separate file
export const LoadingCom = () => {
  return (
     <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}


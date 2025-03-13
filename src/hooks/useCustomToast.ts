import { useToast } from "./use-toast"; // Correct import

export const useCustomToast = () => {
  const { toast } = useToast(); // Destructure `toast` from your hook

  const showToast = (message: string, status?: number) => {
    let bgColor = "bg-gray-900"; // Default dark look
    let borderColor = "border-gray-700";
    let title = "Notification";
    let icon = "🔔"; // Default icon

    if (status) {
      if (status >= 200 && status < 300) {
        bgColor = "bg-green-600";
        borderColor = "border-green-400";
        title = "✅ Success";
      } else if (status >= 400 && status < 500) {
        bgColor = "bg-warning";
        borderColor = "border-yellow-400";
        title = "⚠️ Warning";
      } else if (status >= 500) {
        bgColor = "bg-red-600";
        borderColor = "border-red-400";
        title = "❌ Error";
      }
    }

    toast({
      title, // ✅ Now it's a string, no TypeScript error
      description: message,
      className: `${bgColor} ${borderColor} text-white px-6 py-4 rounded-sm shadow-lg backdrop-blur-md border`,
      duration: 4000, // Show for 4 seconds
    });
  };

  return { showToast };
};

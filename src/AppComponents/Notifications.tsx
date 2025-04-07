"use client";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export default function Notifications(
    // { userId }: { userId: string }
) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

// Fetch notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const res = await fetch(`/api/notifications/${userId}`);
//       const data = await res.json();
//       setNotifications(data.notifications);
//     };
//     fetchNotifications();
//   }, [userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative justify-end">
        <Bell className="w-5 h-5 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
            {notifications.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mr-2">
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-center">No notifications</DropdownMenuItem>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="flex flex-col">
              <span className="text-sm font-medium">{notif.message}</span>
              <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleTimeString()}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// src/components/NotificationBadge.jsx
import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "@mui/material";

// Import the new popup component and its interface
import { NotificationPopup } from "./notificationPopup";
import { FullTodoPopup, PopupMode } from "./fullTodoPopup";
import type { Todo } from "./fullTodoPopup";

export type ShareTodo = {
  id: number;
  taskId: number;
  shareWith: number;
  createdAt: Date;
  isAccepted: "Pending" | "Accepted" | "Rejected";
};

type NotificationBadgeProps = {
  userId: number | null;
};

function NotificationBadge({ userId }: NotificationBadgeProps) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isListPopupOpen, setIsListPopupOpen] = useState(false);
  const [isFullTodoPopupOpen, setIsFullTodoPopupOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>(PopupMode.ViewInvited);

  // Use the full Todo mock data now
  const mockTodos: Todo[] = [
    {
      task_id: 1,
      user_id: 1,
      title: "Cocktail concert",
      description: "ต้องไปรับบัตรเข้างานที่แอร์พอร์ตก่อน",
      is_done: false,
      start_date: new Date("2025-08-20T17:00:00"),
      end_date: new Date("2025-08-21T23:00:00"),
      image_path: null,
    },
    {
      task_id: 2,
      user_id: 1,
      title: "ประชุมกิจกกรรม",
      description: "รายละเอียดการประชุมประจำเดือน",
      is_done: false,
      start_date: new Date("2025-08-25T10:00:00"),
      end_date: new Date("2025-08-25T12:00:00"),
      image_path: null,
    },
  ];
  const [shareTodo, setShareTodo] = useState<ShareTodo[]>([]);

  const fetchShareTodo = async () => {
    try {
      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        console.log("failed to fetch notification");
        return;
      } else {
        const todo = await response.json();
        const pendingTodos = todo.filter((t) => t.isAccepted === "Pending");
        setShareTodo(pendingTodos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchShareTodo();
    setNotificationCount(shareTodo.length);
  }, []);

  const handleListPopupOpen = () => {
    setIsListPopupOpen(true);
  };

  const handleListPopupClose = () => {
    setIsListPopupOpen(false);
  };

  // This handler is called when an item is clicked in the list popup
  const handleNotificationSelect = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsListPopupOpen(false); // Close the list popup
    setIsFullTodoPopupOpen(true); // Open the full todo popup
    setPopupMode(PopupMode.ViewInvited);
  };

  const handleFullTodoPopupClose = () => {
    setIsFullTodoPopupOpen(false);
    setSelectedTodo(null);
  };

  return (
    <>
      <IconButton onClick={handleListPopupOpen}>
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {/* Renders the list of notifications */}
      <NotificationPopup
        open={isListPopupOpen}
        onClose={handleListPopupClose}
        notifications={shareTodo}
        onSelectNotification={handleNotificationSelect}
      />
      {/* Renders the full todo popup */}
      <FullTodoPopup
        open={isFullTodoPopupOpen}
        onClose={handleFullTodoPopupClose}
        todo={selectedTodo}
        mode={popupMode}
      />
    </>
  );
}

export default NotificationBadge;

// src/components/NotificationBadge.jsx
import { useEffect, useState } from "react";
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
  fetchTodo: () => Promise<void> | null;
};

function NotificationBadge({ userId, fetchTodo }: NotificationBadgeProps) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isListPopupOpen, setIsListPopupOpen] = useState(false);
  const [isFullTodoPopupOpen, setIsFullTodoPopupOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>(PopupMode.ViewInvited);

  const [shareTodo, setShareTodo] = useState<ShareTodo[]>([]);

  const fetchShareTodo = async () => {
    try {
      const response = await fetch("/api/todos/shareTodo", {
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
        if (Array.isArray(todo)) {
          const pendingTodos = todo.filter((t) => t.isAccepted === "Pending");
          setShareTodo(pendingTodos);
        } else {
          setShareTodo([]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchShareTodo();
  }, []);

  useEffect(() => {
    setNotificationCount(shareTodo.length);
  }, [shareTodo]);

  const handleListPopupOpen = () => {
    setIsListPopupOpen(true);
  };

  const handleListPopupClose = () => {
    fetchTodo();
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
        shareTodos={shareTodo}
        onSelectNotification={handleNotificationSelect}
        fetchShareTodo={fetchShareTodo}
      />
      {/* Renders the full todo popup */}
      <FullTodoPopup
        open={isFullTodoPopupOpen}
        onClose={handleFullTodoPopupClose}
        todo={selectedTodo}
        mode={popupMode}
        userId={userId}
        fetchShareTodo={fetchShareTodo}
        fetchTodo={async () => {}}
      />
    </>
  );
}

export default NotificationBadge;

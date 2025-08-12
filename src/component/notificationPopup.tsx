import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Todo } from "./fullTodoPopup";
import type { ShareTodo } from "./notificationBadge";

interface NotificationPopupProps {
  open: boolean;
  onClose: () => void;
  shareTodos: ShareTodo[];
  onSelectNotification: (todo: Todo) => void;
  fetchShareTodo: () => void;
  fetchTodo: () => void;
}

export function NotificationPopup({
  open,
  onClose,
  shareTodos,
  onSelectNotification,
  fetchShareTodo,
  fetchTodo,
}: NotificationPopupProps) {
  const [fullShareTodo, setFullShareTodo] = useState<Todo[]>([]);
  const fetchFullShareTodo = async () => {
    const task_id_list = shareTodos.map((item) => item.taskId);

    if (task_id_list.length === 0) {
      return;
    }

    try {
      const response = await fetch("/api/todos/fullTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id_list }),
      });

      if (!response.ok) {
        console.error("Failed to fetch full shared todos.");
        return;
      }

      const fullTodos = await response.json();
      setFullShareTodo(fullTodos);
    } catch (err) {
      console.error("An error occurred:", err);
    }
  };

  const handleAccept = async (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    console.log(`Accepted todo:`, todo);
    console.log("current share TOdo", shareTodos);
    const share_todo_id = shareTodos.filter(
      (item) => item.taskId === todo.id
    )[0].id;

    console.log("this is share id", share_todo_id);

    try {
      const response = await fetch("/api/shareTodo/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: share_todo_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept todo.");
      }

      const result = await response.json();
      console.log("Accept success:", result.message);
      fetchShareTodo();
      fetchTodo();

      alert("Todo accepted successfully!");
    } catch (error) {
      console.error("Error accepting todo:", error);
      alert("Error accepting todo. Please try again.");
    }
  };

  const handleDecline = async (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    console.log(`delince todo:`, todo);
    console.log("current share TOdo", shareTodos);
    const share_todo_id = shareTodos.filter(
      (item) => item.taskId === todo.id
    )[0].id;

    console.log("this is share id", share_todo_id);

    try {
      const response = await fetch("/api/shareTodo/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: share_todo_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to decline todo.");
      }

      const result = await response.json();
      console.log("decline success:", result.message);
      fetchShareTodo();
      fetchTodo();

      alert("Todo decline successfully!");
    } catch (error) {
      console.error("Error decline todo:", error);
      alert("Error decline todo. Please try again.");
    }
  };

  useEffect(() => {
    fetchFullShareTodo();
  }, [shareTodos]);

  useEffect(() => {}, [fullShareTodo]);
  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Notification
        <IconButton onClick={onClose}>
          <CancelIcon aria-label="close" />
        </IconButton>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {fullShareTodo.map((notification) => (
          // Add onClick handler here to trigger the new popup
          <ListItem
            key={notification.id}
            onClick={() => onSelectNotification(notification)}
            sx={{ borderBottom: "1px solid #ccc", py: 2, cursor: "pointer" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: "#f0f0f0" }}> </Avatar>
              <ListItemText
                primary={notification.title}
                secondary={notification.description}
                sx={{ ml: 1 }}
              />
            </Box>
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="accept"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept(e, notification);
                }}
              >
                <CheckCircleIcon sx={{ color: "green" }} />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="decline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecline(e, notification);
                }}
              >
                <CancelIcon sx={{ color: "red" }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

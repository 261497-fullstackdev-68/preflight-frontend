import React from "react";
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

interface NotificationPopupProps {
  open: boolean;
  onClose: () => void;
  notifications: Todo[];
  onSelectNotification: (todo: Todo) => void;
}

export function NotificationPopup({
  open,
  onClose,
  notifications,
  onSelectNotification,
}: NotificationPopupProps) {
  const handleAccept = async (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    console.log(`Accepted todo: ${todo.title}`);
    // Add your logic here to accept the share request
    const share_todo_id = todo.task_id
    try {
      const response = await fetch('/api/shareTodo/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ share_todo_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept todo.');
      }

      const result = await response.json();
      console.log('Accept success:', result.message);

      // --- UI Update Logic ---
      // You need to update the state in the parent component (NotificationBadge)
      // to remove this item from the list. This is best done with a callback.
      // Example: onRemoveNotification(todo.task_id)
      
      alert('Todo accepted successfully!');

    } catch (error) {
      console.error('Error accepting todo:', error);
      alert('Error accepting todo. Please try again.');
    }
  };

  const handleDecline = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    console.log(`Declined todo: ${todo.title}`);
    // Add your logic here to accept the share request
  };

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
          <CancelIcon />
        </IconButton>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {notifications.map((notification) => (
          // Add onClick handler here to trigger the new popup
          <ListItem
            key={notification.task_id}
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
                  e.stopPropagation(); /* handleAccept */
                }}
              >
                <CheckCircleIcon sx={{ color: "green" }} />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="decline"
                onClick={(e) => {
                  e.stopPropagation(); /* handleDecline */
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

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import { SharePopup } from "./sharePopup";

// Using the Todo interface from a previous conversation
export interface Todo {
  task_id: number;
  user_id: number;
  title: string;
  description: string;
  is_done: boolean;
  start_date: Date | null;
  image_path: string | null;
  end_date: Date | null;
}

interface FullTodoPopupProps {
  open: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export function FullTodoPopup({ open, onClose, todo }: FullTodoPopupProps) {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  if (!todo) {
    return null;
  }

  const handleSharePopupOpen = () => {
    setIsSharePopupOpen(true);
  };

  const handleSharePopupClose = () => {
    setIsSharePopupOpen(false);
  };

  const handleAccept = () => {
    console.log(`Accepted todo: ${todo.title}`);
    // Your accept logic here
    onClose();
  };

  const handleDecline = () => {
    console.log(`Declined todo: ${todo.title}`);
    // Your decline logic here
    onClose();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 4 }}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 0,
              pb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {todo.title}
            </Typography>
            <Box>
              <IconButton onClick={handleSharePopupOpen}>
                <ShareIcon />
              </IconButton>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <Box
              sx={{
                width: 150,
                height: 150,
                bgcolor: "#f0f0f0",
                borderRadius: 2,
              }}
            />
            <Box>
              <Typography variant="body1" color="text.secondary">
                {formatDate(todo.start_date)}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pb: 1, borderBottom: "1px solid #ccc" }}
              >
                {formatDate(todo.end_date)}
              </Typography>
              <Typography variant="body2" sx={{ pt: 1, my: 1 }}>
                {todo.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ flexGrow: 1 }}
              onClick={handleAccept}
            >
              accept
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ flexGrow: 1 }}
              onClick={handleDecline}
            >
              decline
            </Button>
          </Box>
        </Box>
      </Dialog>
      <SharePopup open={isSharePopupOpen} onClose={handleSharePopupClose} />
    </>
  );
}

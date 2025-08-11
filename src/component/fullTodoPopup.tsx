// src/components/FullTodoPopup.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import { SharePopup } from "./sharePopup";
import dayjs from "dayjs";
import axios from "axios";

// You will need to define this interface for your todo data
export interface Todo {
  id: number | null;
  userId: number;
  title: string;
  description: string;
  isDone: boolean;
  startDate: string | null;
  endDate: string | null;
  imagePath: string | null;
}

// Use an enum to define the three modes
export enum PopupMode {
  Create = "create",
  Edit = "edit",
  ViewInvited = "viewInvited",
}

interface FullTodoPopupProps {
  open: boolean;
  onClose: () => void;
  mode: PopupMode; // The key prop to control the variant
  todo: Todo | null; // The todo data, only used in 'edit' and 'viewInvited' modes
  fetchShareTodo: () => Promise<void> | null; //fetch only in viewInvited mode
  userId: number | null;
}

export function FullTodoPopup({
  open,
  onClose,
  mode,
  todo,
  userId,
  fetchShareTodo,
}: FullTodoPopupProps) {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(
    mode === PopupMode.Create || mode === PopupMode.Edit
  );

  const [localTodo, setLocalTodo] = useState<Todo>(
    todo || {
      id: null,
      userId: 1, // Default user ID
      title: "",
      description: "",
      isDone: false,
      startDate: null,
      endDate: null,
      imagePath: null,
    }
  );

  useEffect(() => {
    if (open) {
      if (mode === PopupMode.Create) {
        setLocalTodo({
          id: null,
          userId: 1,
          title: "",
          description: "",
          isDone: false,
          startDate: null,
          endDate: null,
          imagePath: null,
        });
        setIsEditing(true);
      } else {
        setLocalTodo(todo || localTodo);
        setIsEditing(mode === PopupMode.Edit);
      }
    }
  }, [open, mode, todo]);

  const handleSharePopupOpen = () => setIsSharePopupOpen(true);
  const handleSharePopupClose = () => setIsSharePopupOpen(false);

  const handleSave = () => {
    console.log("Saving todo:", localTodo);
    // Add your save logic here
    onClose();
  };

  function handleDelete() {
    axios
      .delete("/api/todo", { data: { id: localTodo.id } })
      .then(() => {
        onClose();
      })
      .catch((err) => alert(err));
  }

  const handleAccept = async () => {
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
      }
      const todo = await response.json();
      if (!Array.isArray(todo)) {
        console.log("cannot get todo[]");
        return;
      }

      const pendingTodo = todo.filter((t) => t.taskId === localTodo.id);
      console.log("pending", pendingTodo[0]);

      const acceptResponse = await fetch("/api/shareTodo/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: pendingTodo[0].id }),
      });

      if (!acceptResponse.ok) {
        throw new Error("Failed to accept todo.");
      }

      fetchShareTodo();

      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDecline = async () => {
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
      }
      const todo = await response.json();
      if (!Array.isArray(todo)) {
        console.log("cannot get todo[]");
        return;
      }

      const pendingTodo = todo.filter((t) => t.taskId === localTodo.id);
      console.log("pending", pendingTodo[0]);

      const acceptResponse = await fetch("/api/shareTodo/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: pendingTodo[0].id }),
      });

      if (!acceptResponse.ok) {
        throw new Error("Failed to decline todo.");
      }

      fetchShareTodo();

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const renderButtons = () => {
    switch (mode) {
      case PopupMode.Create:

      case PopupMode.Edit:
        return (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 3 }}
          >
            <Button variant="contained" color="success" onClick={handleSave}>
              save
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              delete
            </Button>
          </Box>
        );
      case PopupMode.ViewInvited:
        return (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 3 }}
          >
            <Button variant="contained" color="success" onClick={handleAccept}>
              accept
            </Button>
            <Button variant="contained" color="error" onClick={handleDecline}>
              decline
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderBody = () => {
    if (isEditing) {
      return (
        <Box>
          <TextField
            fullWidth
            label="Title"
            value={localTodo.title}
            onChange={(e) =>
              setLocalTodo({ ...localTodo, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="datetime-local"
            value={
              localTodo.startDate
                ? dayjs(localTodo.startDate).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={(e) =>
              setLocalTodo({ ...localTodo, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="datetime-local"
            value={
              localTodo.endDate
                ? dayjs(localTodo.endDate).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={(e) =>
              setLocalTodo({ ...localTodo, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={localTodo.description}
            onChange={(e) =>
              setLocalTodo({ ...localTodo, description: e.target.value })
            }
          />
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="body1" color="text.secondary">
            Saturday 20th at 05.00 p.m.
            <br />
            Sunday 21st at 11:00 p.m.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {localTodo.description}
          </Typography>
        </Box>
      );
    }
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
            <Typography variant="h5" fontWeight="bold"></Typography>
            <Box>
              <IconButton onClick={handleSharePopupOpen}>
                <ShareIcon />
              </IconButton>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Box sx={{ display: "flex", gap: 3, pt: 2 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                bgcolor: "grey.300",
                flexShrink: 0,
              }}
            />
            <Box sx={{ flexGrow: 1 }}>{renderBody()}</Box>
          </Box>
          {renderButtons()}
        </Box>
      </Dialog>
      <SharePopup
        open={isSharePopupOpen}
        onClose={handleSharePopupClose}
        userId={userId}
        task_id={todo?.id}
      />
    </>
  );
}

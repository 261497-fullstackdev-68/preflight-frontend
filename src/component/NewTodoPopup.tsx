import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Using the Todo interface from a previous conversation
export interface AddTodo {
  userId: number | null;
  title: string;
  description: string;
  is_done: boolean;
  start_date: Date | null;
  image_path: string | null;
  end_date: Date | null;
}

interface NewTodoPopupProps {
  open: boolean;
  onClose: () => void;
  onCreate: (todo: {
    title: string;
    description: string;
    start_date: Date | null;
    end_date: Date | null;
  }) => void;
  userId: number | null;
}

export function NewTodoPopup({
  open,
  onClose,
  onCreate,
  userId,
}: NewTodoPopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          description,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          "Failed to create todo: " + (errorData.error || response.statusText)
        );
        return;
      }

      const data = await response.json();
      console.log("Created todo:", data);

      // เรียก onCreate เพื่ออัปเดตข้อมูลใน parent component
      onCreate({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
      });

      onClose();
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Something went wrong");
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
            <Typography variant="h5" fontWeight="bold">
              Create New Todo
            </Typography>
            <Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex px-4">
              <DatePicker
                selected={startDate || undefined} // undefined ถ้ายังไม่ได้เลือก
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                className="border rounded px-3 py-2 mr-3"
                placeholderText="Select start date & time"
                popperPlacement="bottom-start"
                withPortal
                fixedHeight
                required
              />
              <Typography sx={{ mt: 1 }}>To</Typography>
              <DatePicker
                selected={endDate || undefined} // undefined ถ้ายังไม่ได้เลือก
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                className="border rounded px-3 py-2 mr-3"
                placeholderText="Select start date & time"
                popperPlacement="bottom-start"
                withPortal
                fixedHeight
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </Box>
      </Dialog>
    </>
  );
}

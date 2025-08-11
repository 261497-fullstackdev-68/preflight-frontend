import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";
import type { GridProps } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";

// Define the User interface based on the mock data
export interface User {
  id: number;
  username: string;
}

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  task_id: number | null | undefined;
}

const gridItemProps: GridProps = {
    item: true,
    xs: 4,
    sm: 3,
    md: 2,
  } as GridProps;

export function SharePopup({
  open,
  onClose,
  userId,
  task_id,
}: SharePopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = async (user: User) => {
    console.log(`Share to ${user.username}`);

    try {
      const response = await fetch("/api/shareTodo/withOthers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: task_id, share_with: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert(data.message);
      const isSelected = selectedUsers.includes(user.id);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
      } else {
        setSelectedUsers([...selectedUsers, user.id]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedUsers([]);
    onClose();
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("api/users");

        if (!res.ok) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to fetch users.",
          });
        } else {
          const users = await res.json();
          const withoutMe = users.filter((t: User) => t.id !== userId);
          setAllUsers(withoutMe);
        }
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "An error occurred while connecting to the server.",
        });
      }
    };
    fetchUsers();
  }, [open, userId]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Share with others
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        <Grid container spacing={2}>
          {filteredUsers.map((user) => (
            <Grid {...gridItemProps} key={user.id.toString()}>
              <Box
                onClick={() => handleUserClick(user)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  padding: 1,
                  borderRadius: 1,
                  backgroundColor: selectedUsers.includes(user.id)
                    ? "#f0f0f0"
                    : "transparent",
                }}
              >
                <Avatar sx={{ width: 56, height: 56, mx: "auto", mb: 1 }} />
                <Typography variant="body2" noWrap>
                  {user.username}
                </Typography>

                {selectedUsers.includes(user.id) && (
                  <Typography variant="caption" color="text.secondary">
                    sent
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
}

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
} from "@mui/material";
import Grid from "@mui/material/Grid";
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
}

export function SharePopup({ open, onClose }: SharePopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user: User) => {
    console.log(`Share to ${user.username}`);
    const isSelected = selectedUsers.includes(user.id);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user.id]);
    }
    console.log(`Share to ${user.username}`);
    // You would likely trigger your actual sharing logic here
  };

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
        setAllUsers(users);
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
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <IconButton onClick={onClose}>
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
            <Grid item xs={4} sm={3} md={2} key={user.id}>
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

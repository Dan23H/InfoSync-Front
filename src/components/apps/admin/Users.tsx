import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, IconButton, CircularProgress, TablePagination } from '@mui/material';
import { getUsers, updateUser } from '../../../api/user';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res) => setUsers(res || []))
      .catch((err) => console.error('Error fetching users', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(users.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [users, rowsPerPage]);

  const handleRoleChange = (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const saveRole = async (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    setSaving((s) => ({ ...s, [id]: true }));
  try {
  await updateUser(id, { role: user.role });
  setSaving((s) => ({ ...s, [id]: false }));
    } catch (err) {
      console.error('Error updating role', err);
      setSaving((s) => ({ ...s, [id]: false }));
      // refresh list
      getUsers().then((res) => setUsers(res || []));
    }
  };

  if (loading) return <CircularProgress />;

  const paginated = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = Math.max(0, rowsPerPage - paginated.length);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Usuarios registrados</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u._id}</TableCell>
                <TableCell>{u.userName}</TableCell>
                <TableCell>{u.userEmail}</TableCell>
                <TableCell>
                  <Select value={u.role || 'student'} onChange={(e) => handleRoleChange(u._id, String(e.target.value))} size="small">
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => saveRole(u._id)} disabled={!!saving[u._id]}>
                    {saving[u._id] ? <CircularProgress size={20} /> : 'Guardar'}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}

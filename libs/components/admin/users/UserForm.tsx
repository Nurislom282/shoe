import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Avatar
} from '@mui/material';
import { MemberUpdate } from '../../../types/member/member.update';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import { REACT_APP_API_URL } from '../../../config';

interface UserFormProps {
    initialValues: MemberUpdate;
    onSubmit: (data: MemberUpdate) => void;
    loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, loading }) => {
    const [formData, setFormData] = useState<MemberUpdate>({
        ...initialValues,
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                        src={formData.memberImage?.startsWith('http') ? formData.memberImage : `${REACT_APP_API_URL}/${formData.memberImage}`}
                        sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="h6">{formData.memberNick}</Typography>
                    <Typography variant="body2" color="textSecondary">ID: {formData._id}</Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <TextField
                            label="Nickname"
                            name="memberNick"
                            value={formData.memberNick}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            name="memberPhone"
                            value={formData.memberPhone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="memberType"
                                value={formData.memberType}
                                label="Type"
                                onChange={handleChange}
                            >
                                {Object.values(MemberType).map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="memberStatus"
                                value={formData.memberStatus}
                                label="Status"
                                onChange={handleChange}
                            >
                                {Object.values(MemberStatus).map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            name="memberDesc"
                            value={formData.memberDesc}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => onSubmit(formData)}
                        disabled={loading}
                        sx={{ minWidth: 200 }}
                    >
                        {loading ? 'Saving...' : 'Update Member'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserForm;

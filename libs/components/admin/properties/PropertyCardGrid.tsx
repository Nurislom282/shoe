import React from 'react';
import Link from 'next/link';
import {
    Button,
    Menu,
    MenuItem,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Grid,
    Box,
    Stack,
    Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Property } from '../../../types/property/property';
import { REACT_APP_API_URL } from '../../../config';
import { PropertyStatus } from '../../../enums/property.enum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface PropertyPanelListType {
    properties: Property[];
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updatePropertyHandler: any;
    removePropertyHandler: any;
}

export const PropertyCardGrid = (props: PropertyPanelListType) => {
    const {
        properties,
        anchorEl,
        menuIconClickHandler,
        menuIconCloseHandler,
        updatePropertyHandler,
        removePropertyHandler,
    } = props;

    if (properties.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    No products found.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {properties.map((property: Property, index: number) => {
                const propertyImage = `${REACT_APP_API_URL}/${property?.propertyImages[0]}`;

                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                borderRadius: '16px',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <Box sx={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <Link href={`/property/detail?id=${property?._id}`}>
                                    <img
                                        src={propertyImage}
                                        alt={property.propertyTitle}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Link>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        bgcolor: property.propertyStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                                        color: '#white',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {property.propertyStatus}
                                </Box>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                                <Link href={`/property/detail?id=${property?._id}`}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#1a1f36',
                                            textDecoration: 'none',
                                            mb: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {property.propertyTitle}
                                    </Typography>
                                </Link>
                                <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ${Number(property.propertyPrice).toLocaleString()}
                                </Typography>
                                {/* <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <LocationOnIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                    <Typography variant="body2" color="textSecondary" noWrap>
                                        {property.propertyLocation}
                                    </Typography>
                                </Stack> */}
                            </CardContent>
                            <CardActions
                                sx={{
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #f0f2f5',
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {/* <Avatar
                                        src={property.memberData?.memberImage ? `${REACT_APP_API_URL}/${property.memberData.memberImage}` : '/img/profile/defaultUser.svg'}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography variant="caption" color="textSecondary">
                                        {property.memberData?.memberNick || 'Unknown Agent'}
                                    </Typography> */}
                                    <Typography variant="caption" color="textSecondary">
                                        ID: {property._id.slice(0, 8).toUpperCase()}
                                    </Typography>
                                </Stack>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e: any) => menuIconClickHandler(e, property._id)}
                                        aria-controls={Boolean(anchorEl[property._id]) ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={Boolean(anchorEl[property._id]) ? 'true' : undefined}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </CardActions>

                            <Menu
                                anchorEl={anchorEl[property._id]}
                                open={Boolean(anchorEl[property._id])}
                                onClose={menuIconCloseHandler}
                                onClick={menuIconCloseHandler}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Box sx={{ p: 1 }}>
                                    <MenuItem
                                        onClick={() => {
                                            menuIconCloseHandler();
                                            // Mock edit redirect
                                            console.log('Edit clicked for', property._id);
                                        }}
                                    >
                                        <Typography variant={'body2'}>Edit Product</Typography>
                                    </MenuItem>

                                    {property.propertyStatus !== PropertyStatus.SOLD && (
                                        <MenuItem
                                            onClick={() => updatePropertyHandler({ _id: property._id, propertyStatus: PropertyStatus.SOLD })}
                                        >
                                            <Typography variant={'body2'}>Mark as Sold</Typography>
                                        </MenuItem>
                                    )}

                                    {property.propertyStatus === PropertyStatus.SOLD && (
                                        <MenuItem
                                            onClick={() => updatePropertyHandler({ _id: property._id, propertyStatus: PropertyStatus.ACTIVE })}
                                        >
                                            <Typography variant={'body2'}>Mark as Active</Typography>
                                        </MenuItem>
                                    )}

                                    <MenuItem
                                        onClick={() => removePropertyHandler(property._id)}
                                    >
                                        <Typography variant={'body2'} color={'error'}>Delete Product</Typography>
                                    </MenuItem>
                                </Box>
                            </Menu>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

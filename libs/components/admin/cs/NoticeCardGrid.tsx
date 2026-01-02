import React from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Moment from 'react-moment';

// Interface for Notice
interface NoticeArticle {
    _id: string;
    noticeCategory: string;
    noticeTitle: string;
    noticeContent: string;
    noticeStatus: string;
    createdAt: string;
    mb_id: string;
    mb_nick: string;
    views?: number;
}

interface NoticeCardGridProps {
    notices: NoticeArticle[];
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updateNoticeHandler: any;
    removeNoticeHandler: any;
}

export const NoticeCardGrid = (props: NoticeCardGridProps) => {
    const { notices, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateNoticeHandler, removeNoticeHandler } =
        props;

    if (!notices || notices.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    No notices found.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {notices.map((notice: NoticeArticle) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={notice._id}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '16px',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    bgcolor: '#f3e5f5',
                                    color: '#7b1fa2',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    mb: 2,
                                }}
                            >
                                {notice.noticeCategory || 'Notice'}
                            </Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1a1f36',
                                    mb: 1,
                                    minHeight: '64px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {notice.noticeTitle}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <VisibilityIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                    <Typography variant="caption" color="textSecondary">
                                        {notice.views || 0}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="textSecondary">
                                    <Moment format={'YYYY.MM.DD'}>{notice.createdAt}</Moment>
                                </Typography>
                            </Stack>
                        </CardContent>
                        <CardActions
                            sx={{
                                justifyContent: 'space-between',
                                borderTop: '1px solid #f0f2f5',
                                px: 2,
                                py: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: notice.noticeStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                                    color: 'white',
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {notice.noticeStatus || 'ACTIVE'}
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e: any) => menuIconClickHandler(e, notice._id)}
                                aria-controls={Boolean(anchorEl[notice._id]) ? 'notice-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={Boolean(anchorEl[notice._id]) ? 'true' : undefined}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                        <Menu
                            anchorEl={anchorEl[notice._id]}
                            open={Boolean(anchorEl[notice._id])}
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
                                <MenuItem onClick={() => console.log('Edit Notice', notice._id)}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EditIcon fontSize="small" />
                                        <Typography variant="body2">Edit</Typography>
                                    </Stack>
                                </MenuItem>
                                <MenuItem onClick={() => removeNoticeHandler(notice._id)}>
                                    <Stack direction="row" spacing={1} alignItems="center" color="error.main">
                                        <DeleteIcon fontSize="small" />
                                        <Typography variant="body2">Delete</Typography>
                                    </Stack>
                                </MenuItem>
                            </Box>
                        </Menu>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

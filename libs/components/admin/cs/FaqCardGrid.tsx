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
import { useRouter } from 'next/router';

// Defining interface locally since it doesn't exist in libs/types
interface FaqArticle {
    _id: string;
    faqCategory: string;
    faqTitle: string;
    faqContent: string;
    faqStatus: string;
    createdAt: string;
    mb_id: string;
    mb_nick: string;
}

interface FaqCardGridProps {
    articles: FaqArticle[]; // Renamed to articles for consistency, or use 'faqs'
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updateArticleHandler: any;
    removeArticleHandler: any;
}

export const FaqCardGrid = (props: FaqCardGridProps) => {
    const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
        props;
    const router = useRouter();

    if (!articles || articles.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    No FAQs found.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {articles.map((article: FaqArticle) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={article._id}>
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
                                    bgcolor: '#e3f2fd',
                                    color: '#1565c0',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    mb: 2,
                                }}
                            >
                                {article.faqCategory || 'General'}
                            </Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1a1f36',
                                    mb: 1,
                                    minHeight: '64px', // ensure consistent height
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {article.faqTitle}
                            </Typography>
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
                                    bgcolor: article.faqStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                                    color: 'white',
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {article.faqStatus || 'ACTIVE'}
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e: any) => menuIconClickHandler(e, article._id)}
                                aria-controls={Boolean(anchorEl[article._id]) ? 'faq-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={Boolean(anchorEl[article._id]) ? 'true' : undefined}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                        <Menu
                            anchorEl={anchorEl[article._id]}
                            open={Boolean(anchorEl[article._id])}
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
                                <MenuItem onClick={() => console.log('Edit FAQ', article._id)}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EditIcon fontSize="small" />
                                        <Typography variant="body2">Edit</Typography>
                                    </Stack>
                                </MenuItem>
                                <MenuItem onClick={() => removeArticleHandler(article._id)}>
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

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
    Tooltip,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { BoardArticle } from '../../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../../config';
import { BoardArticleStatus } from '../../../enums/board-article.enum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';

interface CommunityArticleListProps {
    articles: BoardArticle[];
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updateArticleHandler: any;
    removeArticleHandler: any;
}

const CommunityCardGrid = (props: CommunityArticleListProps) => {
    const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
        props;
    const router = useRouter();

    if (articles.length === 0) {
        return (
            <div style={{ padding: '32px', textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    No articles found.
                </Typography>
            </div>
        );
    }

    return (
        <Grid container spacing={3}>
            {articles.map((article: BoardArticle, index: number) => {
                const memberImage = article?.memberData?.memberImage
                    ? article.memberData.memberImage.startsWith('http') || article.memberData.memberImage.startsWith('/')
                        ? article.memberData.memberImage
                        : `${REACT_APP_API_URL}/${article.memberData.memberImage}`
                    : `/img/profile/defaultUser.svg`;

                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={article._id}>
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
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div
                                        style={{
                                            backgroundColor: '#e0f2f1',
                                            color: '#00695c',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {article.articleCategory}
                                    </div>
                                    {article.articleStatus === BoardArticleStatus.ACTIVE && (
                                        <Tooltip title={'Open article tab'}>
                                            <Link
                                                href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
                                                target="_blank"
                                            >
                                                <IconButton size="small">
                                                    <OpenInBrowserRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>

                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#1a1f36',
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        minHeight: '64px',
                                    }}
                                >
                                    {article.articleTitle}
                                </Typography>

                                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                                        <VisibilityIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="caption" color="textSecondary">
                                            {article.articleViews}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                                        <FavoriteIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="caption" color="textSecondary">
                                            {article.articleLikes}
                                        </Typography>
                                    </div>
                                    <Typography variant="caption" color="textSecondary">
                                        <Moment format={'DD.MM.YY'}>{article?.createdAt}</Moment>
                                    </Typography>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                                    <Link href={`/member?memberId=${article?.memberData?._id}`}>
                                        <Avatar src={memberImage} sx={{ width: 32, height: 32, cursor: 'pointer' }} />
                                    </Link>
                                    <div>
                                        <Link href={`/member?memberId=${article?.memberData?._id}`}>
                                            <Typography variant="subtitle2" sx={{ color: '#1a1f36', fontWeight: 600, cursor: 'pointer' }}>
                                                {article?.memberData?.memberNick || 'Unknown'}
                                            </Typography>
                                        </Link>
                                        <Typography variant="caption" color="textSecondary">
                                            Writer
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>

                            <CardActions
                                sx={{
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #f0f2f5',
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: article.articleStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {article.articleStatus}
                                </div>
                                <div>
                                    <IconButton
                                        size="small"
                                        onClick={(e: any) => menuIconClickHandler(e, article._id)}
                                        aria-controls={Boolean(anchorEl[article._id]) ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={Boolean(anchorEl[article._id]) ? 'true' : undefined}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </div>
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
                                <div style={{ padding: '8px' }}>
                                    <MenuItem
                                        onClick={() => {
                                            menuIconCloseHandler();
                                            router.push(`/_admin/community/${article._id}`);
                                        }}
                                    >
                                        <Typography variant={'body2'}>Edit Article</Typography>
                                    </MenuItem>

                                    {article.articleStatus !== BoardArticleStatus.DELETE && (
                                        <MenuItem
                                            onClick={() => removeArticleHandler(article._id)}
                                        >
                                            <Typography variant={'body2'} color={'error'}>Delete Article</Typography>
                                        </MenuItem>
                                    )}

                                    {Object.values(BoardArticleStatus)
                                        .filter((ele) => ele !== article.articleStatus && ele !== BoardArticleStatus.DELETE)
                                        .map((status: string) => (
                                            <MenuItem
                                                onClick={() => updateArticleHandler({ _id: article._id, articleStatus: status })}
                                                key={status}
                                            >
                                                <Typography variant={'body2'}>{status}</Typography>
                                            </MenuItem>
                                        ))}
                                </div>
                            </Menu>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default CommunityCardGrid;

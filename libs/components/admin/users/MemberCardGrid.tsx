import React from 'react';
import Link from 'next/link';
import {
    Button,
    Menu,
    Fade,
    MenuItem,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Grid,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack, Box } from '@mui/material';
import { Member } from '../../../types/member/member';
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';

interface MemberPanelListType {
    members: Member[];
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updateMemberHandler: any;
}

export const MemberCardGrid = (props: MemberPanelListType) => {
    const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

    if (members.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    No members found.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {members.map((member: Member, index: number) => {
                const member_image = member.memberImage
                    ? `${REACT_APP_API_URL}/${member.memberImage}`
                    : '/img/profile/defaultUser.svg';

                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
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
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                                <Stack alignItems="center" spacing={2}>
                                    <Link href={`/member?memberId=${member._id}`}>
                                        <Avatar
                                            alt={member.memberNick}
                                            src={member_image}
                                            sx={{ width: 80, height: 80, border: '3px solid #f0f2f5' }}
                                        />
                                    </Link>
                                    <Box>
                                        <Link href={`/member?memberId=${member._id}`}>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                sx={{ fontWeight: 'bold', color: '#1a1f36', textDecoration: 'none' }}
                                            >
                                                {member.memberNick}
                                            </Typography>
                                        </Link>
                                        <Typography variant="body2" color="textSecondary">
                                            {member.memberType}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ px: 2, minHeight: '40px' }}>
                                        {member.memberDesc || 'No description available for this user.'}
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
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button
                                        size="small"
                                        startIcon={<PhoneIcon fontSize="small" />}
                                        sx={{
                                            color: '#64748b',
                                            textTransform: 'none',
                                            minWidth: 0,
                                            '&:hover': { color: '#1a1f36', bgcolor: 'transparent' },
                                        }}
                                        href={`tel:${member.memberPhone}`}
                                    >
                                        Call
                                    </Button>
                                </Stack>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e: any) => menuIconClickHandler(e, member._id)}
                                        aria-controls={Boolean(anchorEl[member._id]) ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={Boolean(anchorEl[member._id]) ? 'true' : undefined}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </CardActions>

                            <Menu
                                anchorEl={anchorEl[member._id]}
                                open={Boolean(anchorEl[member._id])}
                                onClose={menuIconCloseHandler}
                                onClick={menuIconCloseHandler}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
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
                                            // Redirect to member detail page (mock or actual)
                                            window.location.href = `/member?memberId=${member._id}`;
                                        }}
                                    >
                                        <Typography variant={'body2'}>Edit Profile</Typography>
                                    </MenuItem>

                                    {member.memberStatus !== MemberStatus.BLOCK && (
                                        <MenuItem
                                            onClick={() => updateMemberHandler({ _id: member._id, memberStatus: MemberStatus.BLOCK })}
                                        >
                                            <Typography variant={'body2'} color={'error'}>Block User</Typography>
                                        </MenuItem>
                                    )}

                                    {member.memberStatus === MemberStatus.BLOCK && (
                                        <MenuItem
                                            onClick={() => updateMemberHandler({ _id: member._id, memberStatus: MemberStatus.ACTIVE })}
                                        >
                                            <Typography variant={'body2'} color={'primary'}>Unblock User</Typography>
                                        </MenuItem>
                                    )}

                                    <MenuItem
                                        onClick={() => updateMemberHandler({ _id: member._id, memberStatus: MemberStatus.DELETE })}
                                    >
                                        <Typography variant={'body2'} color={'error'}>Delete User</Typography>
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

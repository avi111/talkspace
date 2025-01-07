import React from 'react';
import {Box, Button, ButtonGroup, TextField, Typography} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

interface UploadResultProps {
    imageUrl: string;
    expiryDate: Date;
}

export const UploadResult: React.FC<UploadResultProps> = ({imageUrl, expiryDate}) => {
    const copyToClipboard = () => {
        void navigator.clipboard.writeText(imageUrl);
    };

    return (
        <Box sx={{mt: 2}}>
            <Typography variant="h6" gutterBottom>
                Upload Successful!
            </Typography>
            <TextField
                fullWidth
                value={imageUrl}
                variant="outlined"
                size="small"
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <Button
                            onClick={copyToClipboard}
                            startIcon={<ContentCopyIcon width={16}/>}
                            sx={{ml: 1}}
                        >
                            Copy
                        </Button>
                    ),
                }}
                sx={{mb: 2}}
            />
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Expires: {new Date(expiryDate).toLocaleString()}
            </Typography>
            <ButtonGroup variant="contained" sx={{mb: 2}}>
                <Button
                    variant="contained"
                    startIcon={<LaunchIcon width={16}/>}
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Image
                </Button>
                <Button
                    variant="outlined"
                    href="/"
                >
                    Upload Another
                </Button>
            </ButtonGroup>
        </Box>
    );
};
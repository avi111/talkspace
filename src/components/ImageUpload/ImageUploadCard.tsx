import React from 'react';
import {Card, CardContent, CircularProgress, FormControl, FormHelperText, Stack} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {useDropzone} from 'react-dropzone';
import dayjs, {Dayjs} from 'dayjs';
import {ImageDropzone} from './ImageDropzone';
import {UploadResult} from './UploadResult';
import {useApi} from "../../api/useApi.ts";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export const ImageUploadCard: React.FC = () => {
    const mutation = useApi().imageUpload();
    const [expiresAt, setExpiresAt] = React.useState<Dayjs | null | undefined>(null);
    const invalidExpiresAt = !expiresAt || (expiresAt && expiresAt.isBefore(dayjs()));
    const datePickerError = invalidExpiresAt ? 'Expiry date must be in the future' : undefined;

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (files) => {
            if (files[0] && expiresAt && expiresAt.isValid() && expiresAt.isAfter(dayjs())) {
                mutation.mutate({file: files[0], expiresAt: expiresAt.toDate()});
            } else {
                setExpiresAt(null);
            }
        },
        disabled: invalidExpiresAt,
    });

    return (
        <Card sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            <CardContent>
                {!mutation.isSuccess && (
                    <Stack spacing={1}>
                        <FormControl fullWidth>
                        <ImageDropzone
                            isDragActive={isDragActive}
                            getRootProps={getRootProps}
                            getInputProps={getInputProps}
                        />
                            {invalidExpiresAt && <FormHelperText error={invalidExpiresAt}>
                                You must select a future date
                            </FormHelperText>}
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                minDate={dayjs()}
                                label="Expiry date"
                                value={expiresAt}
                                onChange={(newValue) => setExpiresAt(newValue)}
                                slotProps={{
                                    textField: {
                                        helperText: datePickerError,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Stack>
                )}

                {mutation.isPending && (
                    <CircularProgress sx={{display: 'block', mx: 'auto', my: 4}}/>
                )}

                {mutation.isSuccess && mutation.data && (
                    <UploadResult
                        imageUrl={mutation.data.url}
                        expiryDate={mutation.data.expiryDate}
                    />
                )}

                {mutation.isError && (
                    <FormHelperText error>
                        {mutation.error?.message || 'An error occurred'}
                    </FormHelperText>
                )}
            </CardContent>
        </Card>
    );
};
import React, { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { UPLOAD_IMAGE, UPLOAD_IMAGES } from '../../apollo/user/mutation';

// ==========================================
// Custom Hook: useImageUpload
// ==========================================
export const useImageUpload = () => {
    // Mutation for single file
    const [uploadImageMutation] = useMutation(UPLOAD_IMAGE);
    // Mutation for multiple files
    const [uploadImagesMutation] = useMutation(UPLOAD_IMAGES);

    // Upload a single file (e.g., Profile Picture)
    const uploadImage = useCallback(async (file: File, target: string) => {
        try {
            const { data } = await uploadImageMutation({
                variables: { file, target },
            });
            return data.imageUploader; // Returns URL string
        } catch (error) {
            console.error("Single upload failed:", error);
            throw error;
        }
    }, [uploadImageMutation]);

    // Upload multiple files (e.g., Product/Article Images)
    const uploadImages = useCallback(async (files: File[], target: string) => {
        try {
            // Check if files is an array, if not wrap it (though types say File[])
            const fileList = Array.isArray(files) ? files : [files];
            const { data } = await uploadImagesMutation({
                variables: { files: fileList, target },
            });
            return data.imagesUploader; // Returns array of URL strings
        } catch (error) {
            console.error("Multiple upload failed:", error);
            throw error;
        }
    }, [uploadImagesMutation]);

    return { uploadImage, uploadImages };
};

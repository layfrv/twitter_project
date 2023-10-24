import {useState} from 'react';
import {ReactComponent as DeleteIcon} from '../icons/cross.svg';
import {ReactComponent as UploadIcon} from '../icons/upload.svg';
import './UploadImageButton.scss';

interface IUploadButtonProps {
buttonText: string;
label: string;
onChange: (image: FormData | null) => void;
image: File | null;
}

export default function UploadImageButton(props: IUploadButtonProps) {
    const {buttonText, label, onChange, image} = props;

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleUploadAvatar = (event) => {
        const selectedImage = event.target.files[0];
        onChange(selectedImage);

        if (selectedImage) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageSrc = e.target.result as string;
                setImagePreview(imageSrc);
            };

            reader.readAsDataURL(selectedImage);
        } else {
            setImagePreview(null);
        }
    };

    const deleteImageHandler = () => onChange(null);

    return (
        <div className='upload-button__container'>
            <label htmlFor='input-upload'>
                <p className='input-label'>{label}</p>
            </label>

            {image === null ? (
                <div className='upload-button'>
                    <UploadIcon />
                    <input
                        onChange={handleUploadAvatar}
                        id='input-upload'
                        type='file'
                        className='upload-button-btn'
                        accept='.png, .jpeg'
                    />
                    <label
                        htmlFor='input-upload'
                        className='upload-button-label'
                    >
                        {buttonText}
                    </label>
                </div>
            ) : (
                <div className='upload-button-with-image'>
                    <div className='upload-button-with-image__content'>
                        <div className='upload-button-with-image__img'>
                            <img
                                src={imagePreview}
                                alt='preview'
                            />
                        </div>
                        <p>{image.name}</p>
                    </div>
                    <DeleteIcon
                        onClick={deleteImageHandler}
                        style={{width: '32px', height: '32px'}}
                    />
                </div>
            )}
        </div>
    );
}

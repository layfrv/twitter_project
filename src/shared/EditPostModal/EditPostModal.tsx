import {useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {
    editPost,
    getPostById,
    uploadImagePost,
} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Loader from '../../ui/Loader';
import ModalWrapper from '../../ui/ModalWrapper';
import ReturnButton from '../../ui/ReturnButton';
import Tag from '../../ui/Tag';
import TextField from '../../ui/TextField';
import UploadImageButton from '../../ui/UploadImageButton';
import {ReactComponent as CloseIcon} from '../../ui/icons/close-modal.svg';
import './EditPostModal.scss';

type EditPostModalProps = {
  openEditModalHandler: () => void
}

export default function EditPostModal(props: EditPostModalProps) {
    const dispatch = useAppDispatch();
    const postStatus = useAppSelector((state) => state.posts.postStatus);
    const {selectedPostId, selectedPost} = useAppSelector(
        (state) => state.posts,
    );

    useEffect(() => {
        dispatch(getPostById(selectedPostId));
    }, []);

    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);

    const [title, setTitle] = useState('');
    const handleTitleChange = (newValue) => setTitle(newValue);

    const [postText, setPostText] = useState('');
    const handlePostTextChange = (newValue) => setPostText(newValue);

    const [tag, setTag] = useState('');
    const handleTagChange = (newValue) => setTag(newValue);

    const [tags, setTags] = useState([]);
    const handleTagsChange = () => {
        setTags([...tags, tag.trim()]);
        setTag('');
    };

    useEffect(() => {
        if (selectedPost !== null && postStatus === 'succeeded') {
            handleTitleChange(selectedPost.title);
            handlePostTextChange(selectedPost.text);
            setTags(selectedPost.tags.map((tagElement: any) => tagElement.title));
        }
    }, [selectedPost]);

    const [image, setImage] = useState(null);
    const handleImageChange = (value: FormData) => setImage(value);
    const [disabled, setDisabled] = useState({disabled: true});

    const isDesktop = useMediaQuery({
        query: '(min-width: 950px)',
    });

    const createData = () => {
        const data = {
            title: title.trim(),
            text: postText.trim(),
            tags,
        };

        const newData: any = {};
        for (const key in data) {
            if (data[key] !== selectedPost[key] && data[key].length > 0) {
                newData[key] = data[key];
            }
        }
        return newData;
    };

    const handleUploadPost = async () => {
        const postData = createData();

        try {
            if (image !== null) {
                const imageFile = new FormData();
                imageFile.append('file', image);
                const imageData = {imageFile, selectedPostId};
                dispatch(uploadImagePost(imageData));
            }

            await dispatch(editPost(postData));

            if (postStatus === 'succeeded') {
                setSuccessModal(true);
            } else {
                setErrorModal(true);
            }
        } catch (error) {
            setErrorModal(true);
        }

        setTitle('');
        setPostText('');
        setImage(null);
    };

    if (postStatus === 'loading') {
        return <Loader />;
    }

    return (
        <ModalWrapper>
            <div className='edit-post-modal'>
                {!isDesktop && (
                    <ReturnButton onClickHandler={props.openEditModalHandler} />
                )}

                <div className='edit-post-modal__header'>
                    <h2>Редактировать пост</h2>
                    {isDesktop && (
                        <button onClick={props.openEditModalHandler}>
                            <CloseIcon />
                        </button>
                    )}
                </div>

                <div className='edit-post-modal__content'>
                    <TextField
                        label='Заголовок'
                        name='Заголовок'
                        value={title}
                        placeholder='Введите текст'
                        onChange={handleTitleChange}
                        minLength={5}
                    />

                    <TextField
                        label='Основной текст'
                        name='Основной текст'
                        value={postText}
                        placeholder='Введите текст'
                        onChange={handlePostTextChange}
                        minLength={10}
                    />

                    <UploadImageButton
                        image={image}
                        label='Изображение'
                        buttonText='Нажмите для загрузки'
                        onChange={handleImageChange}
                    />

                    <Input
                        label='Теги'
                        type='text'
                        name='Теги'
                        placeholder='Выберите теги'
                        value={tag}
                        onChange={handleTagChange}
                    />

                    {tags.length > 0 && (
                        <div className='edit-post-modal__tags'>
                            <div className='edit-post-modal__tags_elements'>
                                {tags.map((tagElement, id) => (
                                    <Tag
                                        text={tag}
                                        key={id}
                                    />
                                ))}
                            </div>
                            <button
                                className='edit-post-modal__tags_clear'
                                onClick={() => setTags([])}
                            >
                                Удалить все
                            </button>
                        </div>
                    )}

                    {tag !== '' && (
                        <Button
                            label='Добавить тег'
                            secondary
                            onClick={handleTagsChange}
                        />
                    )}
                </div>

                <Button
                    label='Опубликовать пост'
                    primary
                    onClick={handleUploadPost}
                />
            </div>

            {successModal && (
                <ModalWrapper>
                    <div className='edit-post-modal__header'>
                        <h2>Пост отредактирован!</h2>
                        <CloseIcon
                            onClick={() => {
                                setSuccessModal(false);
                                props.openEditModalHandler();
                            }}
                        />
                    </div>
                </ModalWrapper>
            )}

            {errorModal && (
                <ModalWrapper>
                    <div className='edit-post-modal__header'>
                        <h2>Ошибка редактирования поста</h2>
                        <CloseIcon
                            onClick={() => {
                                setErrorModal(false);
                                props.openEditModalHandler();
                            }}
                        />
                    </div>
                </ModalWrapper>
            )}
        </ModalWrapper>
    );
}

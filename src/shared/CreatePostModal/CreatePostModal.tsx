import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useMediaQuery} from 'react-responsive';
import {createPost} from '../../redux/postsReducer';
import {RootState, useAppDispatch} from '../../redux/store';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Loader from '../../ui/Loader';
import ModalWrapper from '../../ui/ModalWrapper';
import ReturnButton from '../../ui/ReturnButton';
import Tag from '../../ui/Tag';
import TextField from '../../ui/TextField';
import UploadImageButton from '../../ui/UploadImageButton';
import {ReactComponent as CloseIcon} from '../../ui/icons/close-modal.svg';
import './CreatePostModal.scss';

type CreatePostModalProps = {
  createPostModalHandler: () => void;
}

export default function CreatePostModal(props: CreatePostModalProps) {
    const dispatch = useAppDispatch();
    const postStatus = useSelector((state: RootState) => state.posts.postStatus);

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
        if (tag.trim().length > 0) {
            setTags([...tags, tag]);
            setTag('');
        }
        setTag('');
    };

    const [image, setImage] = useState(null);
    const handleImageChange = (value: FormData) => setImage(value);

    const [disabled, setDisabled] = useState({disabled: true});

    useEffect(() => {
        if (title.length > 5 && postText.length > 10) {
            setDisabled({disabled: false});
        } else {
            setDisabled({disabled: true});
        }
    }, [title, postText]);

    const postData = {
        title: title.trim(),
        text: postText.trim(),
        tags,
        image,
    };

    const handleUploadPost = async () => {
        try {
            await dispatch(createPost(postData));
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
        setTags([]);
        setImage(null);
    };

    const onKeyDownHandler = (event) => {
        if (event.key === 'Enter') {
            handleTagsChange();
        }
    };

    const isDesktop = useMediaQuery({
        query: '(max-width: 1050px)',
    });

    return (
        <ModalWrapper>
            <div className='create-post-modal'>
                {isDesktop && (
                    <ReturnButton onClickHandler={props.createPostModalHandler} />
                )}

                <div className='create-post-modal__header'>
                    <h2>Добавить пост</h2>
                    {!isDesktop && (
                        <button onClick={props.createPostModalHandler}>
                            <CloseIcon />
                        </button>
                    )}
                </div>

                <div className='create-post-modal__content'>
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
                        onKeyDownHandler={onKeyDownHandler}
                    />

                    {tags.length > 0 && (
                        <div className='create-post-modal__tags'>
                            <div className='create-post-modal__tags_elements'>
                                {tags.map((tagElement) => (
                                    <Tag
                                        text={tagElement}
                                        key={tagElement}
                                    />
                                ))}
                            </div>
                            <button
                                className='create-post-modal__tags_clear'
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
                    isDisabled={disabled}
                    onClick={handleUploadPost}
                />

                {postStatus === 'loading' && <Loader />}
            </div>

            {successModal && (
                <ModalWrapper width='400px'>
                    <div className='create-post-modal__header'>
                        <h2>Пост отправлен!</h2>
                        <CloseIcon
                            onClick={() => {
                                setSuccessModal(false);
                                props.createPostModalHandler();
                            }}
                        />
                    </div>
                </ModalWrapper>
            )}

            {errorModal && (
                <ModalWrapper width='400px'>
                    <div className='create-post-modal__header'>
                        <h2>Ошибка загрузки поста</h2>
                        <CloseIcon
                            onClick={() => {
                                setErrorModal(false);
                                props.createPostModalHandler();
                            }}
                        />
                    </div>
                </ModalWrapper>
            )}
        </ModalWrapper>
    );
}

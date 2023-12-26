import Button from '../../ui/Button';
import ModalWrapper from '../../ui/ModalWrapper';
import './DeleteModal.scss';

type DeleteModalProps = {
  handleDeleteUser: () => void,
  openDeleteModal: () => void,
}

export default function DeleteModal(props: DeleteModalProps) {
    return (
        <ModalWrapper>
            <div className='delete-modal'>
                <h2 style={{textAlign: 'center'}}>
                    Вы уверены, что хотите удалить профиль?
                </h2>
                <div className='delete-modal__buttons'>
                    <Button
                        label='Да'
                        secondary
                        onClick={props.handleDeleteUser}
                    />
                    <Button
                        label='В другой раз'
                        primary
                        onClick={props.openDeleteModal}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
}

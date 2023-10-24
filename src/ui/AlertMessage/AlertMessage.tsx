import {ReactComponent as AlertIconError} from '../icons/alert-icon-error.svg';
import {ReactComponent as AlertIconSuccess} from '../icons/alert-icon-success.svg';
import './AlertMessage.scss';

interface IAlert {
error?: string;
success?: boolean;
text?: string;
}

export default function AlertMessage(props: IAlert) {
    const {error, success, text} = props;

    return (
        <div
            className={error ? 'alert-container__error' : 'alert-container__success'}
        >
            <div className='alert-content'>
                <span className='alert-content__icon'>
                    {error ? <AlertIconError /> : <AlertIconSuccess />}
                </span>
                <p className='alert-content__text'>{error || text}</p>
            </div>
        </div>
    );
}

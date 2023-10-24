import React from 'react';

const useClickOutside = (ref, callback) => {
    React.useEffect(() => {
        const checkIfClickedOutside = (event) => {
            if (!ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [ref, callback]);
};

export default useClickOutside;
